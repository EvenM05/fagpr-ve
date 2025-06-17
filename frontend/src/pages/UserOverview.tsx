import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  InputAdornment,
  Button,
  Container,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  VisibilityOff,
  Lock,
  Visibility,
  Add,
} from "@mui/icons-material";
import {
  useDeleteUser,
  useGetUserPagination,
  useGetUserRoleData,
  usePostUser,
  useUpdateUser,
} from "../api/hooks";
import { getRoleName, RoleEnum } from "../utilities/enums/roleEnums";
import {
  UpdateUserModel,
  UserData,
} from "../utilities/Interfaces/UserInterfaces";
import { Controller, useForm } from "react-hook-form";
import { CreateUserDialog } from "../components/createUserDialog";
import useDebounce from "../utilities/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import { GET_USER_PAGINATION } from "../api/constants";

const getRoleLabel = (role: RoleEnum): string => {
  switch (role) {
    case RoleEnum.User:
      return "User";
    case RoleEnum.ProjectManager:
      return "Project Manager";
    case RoleEnum.Admin:
      return "Admin";
    default:
      return "Unknown";
  }
};

const getRoleColor = (
  role: RoleEnum,
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (role) {
    case RoleEnum.User:
      return "default";
    case RoleEnum.ProjectManager:
      return "primary";
    case RoleEnum.Admin:
      return "error";
    default:
      return "default";
  }
};

export const UserOverview = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined);
  const [searchValue, setSearchValue] = useState("");

  const [dialogString, setDialogString] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const [editUser, setEditUser] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const debouncedSearch = useDebounce(searchValue, 500);
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [GET_USER_PAGINATION],
    });
  };

  const { data: userData } = useGetUserPagination(
    debouncedSearch,
    page,
    pageSize,
    roleFilter,
  );
  const { data: userRoleData } = useGetUserRoleData();
  const { mutateAsync: createUser } = usePostUser(onSuccess);
  const { mutateAsync: deleteUser } = useDeleteUser(onSuccess);
  const { mutateAsync: updateUser } = useUpdateUser(onSuccess);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserModel>({
    defaultValues: {
      name: "",
      password: "",
      roleId: RoleEnum.User,
    },
  });

  const onSubmit = async (model: UpdateUserModel) => {
    const updateModel = {
      userId: editUser,
      model,
    };
    updateUser(updateModel);
    setEditUser("");
  };

  const renderComponent = () => {
    switch (dialogString) {
      case "CreateUser":
        return (
          <CreateUserDialog
            createUser={createUser}
            handleClose={() => setDialogOpen(false)}
          />
        );
    }
  };

  const handleEditUser = (userId: string) => {
    setEditUser(userId);
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId);
  };

  const handleAddUser = () => {
    setDialogString("CreateUser");
    setDialogOpen(true);
  };

  if (!userData || !userRoleData) {
    return (
      <Box>
        <CircularProgress />
        <Typography>Loading...</Typography>
      </Box>
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
            User Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your users and their information
          </Typography>
        </Box>

        <Grid container spacing={3} mb={3}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {userRoleData.total}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  sx={{ fontWeight: 700 }}
                >
                  {userRoleData.regularUser}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Regular Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography
                  variant="h4"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  {userRoleData?.pmUser}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Project Managers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="error" sx={{ fontWeight: 700 }}>
                  {userRoleData?.adminUser}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Administrators
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box mb={3}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Search users"
                variant="outlined"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search by name or email..."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Filter by Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Filter by Role"
                >
                  <MenuItem value={undefined}>All Roles</MenuItem>
                  <MenuItem value={RoleEnum.User}>Users</MenuItem>
                  <MenuItem value={RoleEnum.ProjectManager}>
                    Project Managers
                  </MenuItem>
                  <MenuItem value={RoleEnum.Admin}>Administrators</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Button
                onClick={handleAddUser}
                sx={{ p: "1em" }}
                startIcon={<Add />}
              >
                Create user
              </Button>
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography fontWeight="bold">Name</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Email</Typography>
                </TableCell>
                <TableCell>
                  <Typography fontWeight="bold">Role</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography fontWeight="bold">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData?.totalItems === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body1" color="textSecondary">
                      {searchValue || roleFilter !== 0
                        ? "No users match your search criteria."
                        : "No users found."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                userData?.items.map((user: UserData) => {
                  return editUser === user.id ? (
                    <>
                      <TableRow
                        key={user.id}
                        hover
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <TableCell>
                          <Controller
                            name="name"
                            control={control}
                            rules={{
                              required: "Name is required",
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Name"
                                type="name"
                                error={!!errors.name}
                                helperText={errors.name?.message}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name="password"
                            control={control}
                            rules={{
                              required: "Password is required",
                            }}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Lock color="action" />
                                    </InputAdornment>
                                  ),
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onClick={() =>
                                          setShowPassword(!showPassword)
                                        }
                                        edge="end"
                                      >
                                        {showPassword ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <Controller
                            name="roleId"
                            control={control}
                            render={({ field }) => (
                              <FormControl fullWidth error={!!errors.roleId}>
                                <InputLabel>Role</InputLabel>
                                <Select {...field} label="Role">
                                  <MenuItem value={RoleEnum.User}>
                                    {getRoleName(RoleEnum.User)}
                                  </MenuItem>
                                  <MenuItem value={RoleEnum.ProjectManager}>
                                    {getRoleName(RoleEnum.ProjectManager)}
                                  </MenuItem>
                                  <MenuItem value={RoleEnum.Admin}>
                                    {getRoleName(RoleEnum.Admin)}
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            )}
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Button onClick={() => setEditUser("")}>
                            <Typography>Cancel</Typography>
                          </Button>

                          <Button
                            variant="contained"
                            sx={{ ml: "0.5em" }}
                            onClick={handleSubmit(onSubmit)}
                          >
                            <Typography>Save</Typography>
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          {user.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {user.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getRoleLabel(user.roleId)}
                          color={getRoleColor(user.roleId)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit User">
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user.id)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {userData?.totalItems > 0 && (
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Showing {userData.totalItems} of {userData.totalItems} users
          </Typography>
        </Box>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, maxHeight: "90vh" },
        }}
      >
        {renderComponent()}
      </Dialog>
    </Box>
  );
};
