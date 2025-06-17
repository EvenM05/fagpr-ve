import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Snackbar,
  Alert,
  Pagination,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import useDebounce from "../utilities/useDebounce";
import {
  CreateCustomerData,
  CustomerData,
} from "../utilities/Interfaces/CustomerInterface";
import { GET_CUSTOMER_PAGINATION } from "../api/constants";
import { useGetCustomerPagination, usePostCustomer } from "../api/hooks";

export default function CustomerOverview() {
  const [open, setOpen] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const shouldMaintainFocus = useRef(false);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(searchValue, 500);

  const [editingCustomer, setEditingCustomer] = useState<CustomerData | null>(
    null,
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [GET_CUSTOMER_PAGINATION],
    });
  };

  const { mutateAsync: createCustomer } = usePostCustomer(onSuccess);
  const { data: customerData } = useGetCustomerPagination(
    debouncedSearch,
    page,
    pageSize,
  );

  useEffect(() => {
    if (shouldMaintainFocus.current && searchInputRef.current) {
      searchInputRef.current.focus();
      shouldMaintainFocus.current = false;
    }
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCustomerData>({
    defaultValues: {
      name: "",
      contactMail: "",
      organizationNumber: 0,
    },
  });

  const handleOpenDialog = (customer?: CustomerData) => {
    if (customer) {
      setEditingCustomer(customer);
      reset({
        name: customer.name,
        contactMail: customer.contactMail,
        organizationNumber: customer.organizationNumber,
      });
    } else {
      setEditingCustomer(null);
      reset({
        name: "",
        contactMail: "",
        organizationNumber: 0,
      });
    }
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setEditingCustomer(null);
    reset();
  };

  const onSubmit = (data: CreateCustomerData) => {
    setTimeout(() => {
      if (editingCustomer) {
        setSnackbar({
          open: true,
          message: "Customer updated successfully!",
          severity: "success",
        });
      } else {
        createCustomer(data);
        setSnackbar({
          open: true,
          message: "Customer added successfully!",
          severity: "success",
        });
      }
      handleCloseDialog();
    }, 1000);
  };

  const handleDeleteCustomer = (id: string) => {
    setSnackbar({
      open: true,
      message: "Customer deleted successfully!",
      severity: "success",
    });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    shouldMaintainFocus.current = true;
    setSearchValue(event.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setPage(1);
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(1);
  };

  const totalPages = customerData
    ? Math.ceil(customerData.totalItems / pageSize)
    : 0;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) || "Please enter a valid email address";
  };

  if (!customerData) {
    return (
      <Container
        maxWidth="lg"
        sx={{ py: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box
      sx={{
        paddingTop: "4em",
        height: "95vh",
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 4, pb: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Customer Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your customers and their information
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: "2em",
            mb: "4em",
          }}
        >
          <Card
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              width: "25%",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    {customerData?.totalItems}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total Customers
                  </Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
          <Card
            sx={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              color: "white",
              width: "25%",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h4"
                    component="div"
                    sx={{ fontWeight: "bold" }}
                  >
                    100%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Active Status
                  </Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Card sx={{ boxShadow: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h5"
                component="h2"
                sx={{ fontWeight: "bold" }}
              >
                Customer List
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Customer
              </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                inputRef={searchInputRef}
                fullWidth
                variant="outlined"
                placeholder="Search customers by name or organization number..."
                value={searchValue}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchValue && (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleClearSearch}
                        edge="end"
                        size="small"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {searchValue
                  ? `Found ${customerData.totalItems} results for "${searchValue}"`
                  : `Showing ${customerData.items.length} of ${customerData.totalItems} customers`}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Rows per page:
                </Typography>
                <TextField
                  select
                  size="small"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                  SelectProps={{
                    native: true,
                  }}
                  sx={{ width: 80 }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </TextField>
              </Box>
            </Box>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "grey.100" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Company Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Contact Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Organization Number
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerData.items.length > 0 ? (
                    customerData.items.map((customer) => (
                      <TableRow key={customer.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <BusinessIcon
                              sx={{ mr: 1, color: "primary.main" }}
                            />
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: "medium" }}
                            >
                              {customer.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <EmailIcon sx={{ mr: 1, color: "grey.600" }} />
                            {customer.contactMail}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={customer.organizationNumber.toString()}
                            variant="outlined"
                            size="small"
                            sx={{ fontFamily: "monospace" }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(customer)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                          {searchValue
                            ? "No customers found matching your search."
                            : "No customers available."}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle sx={{ pb: 1 }}>
              <Typography
                variant="h5"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Company name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Company Name"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="contactMail"
                    control={control}
                    rules={{
                      required: "Email is required",
                      validate: validateEmail,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Contact Email"
                        type="email"
                        error={!!errors.contactMail}
                        helperText={errors.contactMail?.message}
                        variant="outlined"
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="organizationNumber"
                    control={control}
                    rules={{
                      required: "Organization number is required",
                      min: {
                        value: 1,
                        message: "Organization number must be greater than 0",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Organization Number"
                        type="number"
                        error={!!errors.organizationNumber}
                        helperText={errors.organizationNumber?.message}
                        variant="outlined"
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3, pt: 2 }}>
              <Button onClick={handleCloseDialog} variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" sx={{ ml: 1 }}>
                Save
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
