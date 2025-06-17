import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Divider,
  Paper,
  Container,
  IconButton,
  Tooltip,
  LinearProgress,
  Stack,
  Pagination,
  SelectChangeEvent,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Add,
  Business,
} from "@mui/icons-material";
import {
  useGetProjectPagination,
  useGetProjectStatusList,
  usePostProject,
} from "../api/hooks";
import {
  getStatusColor,
  getStatusName,
  StatusEnum,
} from "../utilities/enums/statusEnums";
import { ResourceData } from "../utilities/Interfaces/ResourceInterface";
import useDebounce from "../utilities/useDebounce";
import { ProjectViewDialog } from "../components/projectViewDialog";
import {
  GET_PROJECT_PAGINATION,
  GET_PROJECT_STATUS_LIST,
} from "../api/constants";
import { useQueryClient } from "@tanstack/react-query";
import useAuthService from "../utilities/authService";

const ProjectOverview: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState<number | undefined>(
    undefined,
  );
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const queryClient = useQueryClient();
  const { user, isAdmin, isPM } = useAuthService();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [GET_PROJECT_PAGINATION],
    });
    queryClient.invalidateQueries({
      queryKey: [GET_PROJECT_STATUS_LIST],
    });
  };

  const { mutateAsync: createProject } = usePostProject(onSuccess);

  const { data: projectStatusData } = useGetProjectStatusList();
  const { data: projectData } = useGetProjectPagination(
    debouncedSearch,
    page,
    rowsPerPage,
    sortOrder,
    statusFilter,
  );

  const handleCreateProject = () => {
    if (user) {
      createProject({
        name: "New project",
        description: "",
        createdUserId: user.id,
      });
    }
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent) => {
    const value = parseInt(event.target.value, 10);
    setRowsPerPage(value);
    setPage(1);
  };

  const totalPages = projectData
    ? Math.ceil(projectData.totalItems / rowsPerPage)
    : 0;

  const calculateTotalCost = (resources: ResourceData[]): number => {
    return resources.reduce((total, resource) => total + resource.totalCost, 0);
  };

  const calculateTotalHours = (resources: ResourceData[]): number => {
    return resources.reduce((total, resource) => total + resource.timeHours, 0);
  };

  const getProgressValue = (status: StatusEnum): number => {
    switch (status) {
      case StatusEnum.ToDo:
        return 0;
      case StatusEnum.InProgress:
        return 50;
      case StatusEnum.Completed:
        return 100;
      case StatusEnum.Cancelled:
        return 100;
      default:
        return 0;
    }
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        paddingTop: "4em",
        minHeight: "95vh",
      }}
    >
      <Container maxWidth="xl" sx={{ pt: 4, pb: 6 }}>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: 700, color: "#ebebeb" }}
              >
                Project Overview
              </Typography>
              <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Manage and track your projects efficiently
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Toggle Filters">
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  color={showFilters ? "info" : "default"}
                  sx={{
                    bgcolor: showFilters ? "primary.50" : "transparent",
                    "&:hover": { bgcolor: "primary.100" },
                  }}
                >
                  <FilterIcon />
                </IconButton>
              </Tooltip>

              {(isAdmin() || isPM()) && (
                <Button startIcon={<Add />} onClick={handleCreateProject}>
                  <Typography>Create project</Typography>
                </Button>
              )}
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "primary.main" }}
                  >
                    {projectStatusData?.totalProjects || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Projects
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "success.main" }}
                  >
                    {projectData?.items.filter(
                      (p) => p.status === StatusEnum.Completed,
                    ).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "info.main" }}
                  >
                    {projectData?.items.filter(
                      (p) => p.status === StatusEnum.InProgress,
                    ).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: "warning.main" }}
                  >
                    {projectData?.items.filter(
                      (p) => p.status === StatusEnum.ToDo,
                    ).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    To Do
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {showFilters && (
          <Paper
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 2 }}
            >
              Filters & Search
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  placeholder="Search projects..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: "text.secondary", mr: 1 }} />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value={undefined}>All Statuses</MenuItem>
                    <MenuItem value={StatusEnum.ToDo}>To Do</MenuItem>
                    <MenuItem value={StatusEnum.InProgress}>
                      In Progress
                    </MenuItem>
                    <MenuItem value={StatusEnum.Completed}>Completed</MenuItem>
                    <MenuItem value={StatusEnum.Cancelled}>Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Sort Order</InputLabel>
                  <Select
                    value={sortOrder}
                    label="Sort Order"
                    onChange={(e) => setSortOrder(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="desc">Newest First</MenuItem>
                    <MenuItem value="asc">Oldest First</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSearchValue("");
                    setStatusFilter(0);
                    setSortOrder("desc");
                  }}
                  sx={{ py: 1.5, borderRadius: 2 }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        <Grid container spacing={3}>
          {projectData && projectData.items.length > 0 ? (
            projectData.items.map((project) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease-in-out",
                    cursor: "pointer",
                    bgcolor: "white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "grey.200",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                      borderColor: "primary.200",
                    },
                  }}
                >
                  <CardContent
                    sx={{ flexGrow: 1, p: 3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProjectId(project.id);
                      setDialogOpen(true);
                    }}
                  >
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 600,
                            color: "grey.900",
                            lineHeight: 1.3,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {project.name}
                        </Typography>
                        <Chip
                          label={getStatusName(project.status)}
                          color={getStatusColor(project.status)}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            minWidth: 70,
                          }}
                        />
                      </Box>

                      <Box sx={{ mt: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={getProgressValue(project.status)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: "grey.200",
                            "& .MuiLinearProgress-bar": {
                              borderRadius: 3,
                              bgcolor:
                                project.status === StatusEnum.Cancelled
                                  ? "#d32f2f"
                                  : "",
                            },
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      sx={{
                        mb: 2,
                        lineHeight: 1.5,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {project.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <TimeIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "primary.main" }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {calculateTotalHours(project.resources)}h
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <MoneyIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "success.main" }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {calculateTotalCost(
                            project.resources,
                          ).toLocaleString()}
                          kr
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            mr: 1,
                            fontSize: "0.75rem",
                            bgcolor: "primary.main",
                            color: "white",
                          }}
                        >
                          {project.createdUser.name.charAt(0)}
                        </Avatar>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {project.createdUser.name}
                        </Typography>
                      </Box>
                      {project.customer && (
                        <Stack direction="row" alignItems="center" gap="0.5em">
                          <Business />
                          <Typography variant="caption">
                            {project.customer.name}
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ textAlign: "center", mt: 6, py: 6, width: "100%" }}>
              <TrendingUpIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, color: "grey.700" }}
              >
                No projects found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {searchValue || statusFilter
                  ? "Try adjusting your filters to see more projects."
                  : "Get started by creating your first project."}
              </Typography>
            </Box>
          )}
        </Grid>

        {projectData && projectData.items.length > 0 && (
          <Paper
            sx={{
              mt: 4,
              p: 2,
              bgcolor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Items per page:
                </Typography>
                <FormControl size="small" sx={{ minWidth: 80 }}>
                  <Select
                    value={rowsPerPage.toString()}
                    onChange={handleRowsPerPageChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value={"6"}>6</MenuItem>
                    <MenuItem value={"12"}>12</MenuItem>
                    <MenuItem value={"24"}>24</MenuItem>
                    <MenuItem value={"48"}>48</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Typography variant="body2" color="text.secondary">
                Showing {(page - 1) * rowsPerPage + 1}-
                {Math.min(page * rowsPerPage, projectData.totalItems)} of{" "}
                {projectData.totalItems} projects
              </Typography>

              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                    fontWeight: 500,
                  },
                  "& .Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        )}
      </Container>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          sx: { borderRadius: 3, maxHeight: "90vh" },
        }}
      >
        <ProjectViewDialog
          projectId={selectedProjectId}
          handleClose={() => setDialogOpen(false)}
        />
      </Dialog>
    </Box>
  );
};

export default ProjectOverview;
