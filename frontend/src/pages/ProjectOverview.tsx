import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab,
  Avatar,
  Divider,
  Paper,
  Alert,
  Stack,
  Container,
  IconButton,
  Tooltip,
  LinearProgress,
  CardActions,
  Skeleton,
} from "@mui/material";
import {
  Add as AddIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useGetProjectPagination, useGetProjectStatusList } from "../api/hooks";
import { StatusEnum } from "../utilities/enums/statusEnums";
import { ProjectData } from "../utilities/Interfaces/ProjectInterface";
import { ResourceData } from "../utilities/Interfaces/ResourceInterface";
import useDebounce from "../utilities/useDebounce";

const getStatusColor = (
  status: StatusEnum,
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (status) {
    case StatusEnum.ToDo:
      return "default";
    case StatusEnum.InProgress:
      return "info";
    case StatusEnum.Completed:
      return "success";
    case StatusEnum.Cancelled:
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: StatusEnum): string => {
  switch (status) {
    case StatusEnum.ToDo:
      return "To Do";
    case StatusEnum.InProgress:
      return "In Progress";
    case StatusEnum.Completed:
      return "Completed";
    case StatusEnum.Cancelled:
      return "Cancelled";
    default:
      return "Unknown";
  }
};

interface ProjectFormData {
  name: string;
  description: string;
  status: StatusEnum;
  createdUserId: string;
  updatedUserId: string;
}

const ProjectOverview: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useDebounce(searchValue, 500);

  const { data: projectStatusData } = useGetProjectStatusList();

  const { data: projectData, isLoading: projectLoading } =
    useGetProjectPagination(
      debouncedSearch,
      page,
      rowsPerPage,
      sortOrder,
      statusFilter,
    );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    defaultValues: {
      name: "",
      description: "",
      status: StatusEnum.ToDo,
      createdUserId: "",
      updatedUserId: "",
    },
  });

  const handleOpenDialog = (project?: ProjectData) => {
    if (project) {
      setSelectedProject(project);
      setIsEditing(true);
      reset({
        name: project.name,
        description: project.description,
        status: project.status,
        createdUserId: project.createdUser.id,
        updatedUserId: project.updatedUser.id,
      });
    } else {
      setSelectedProject(null);
      setIsEditing(false);
      reset();
    }
    setIsDialogOpen(true);
  };

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
        height: "100vh",
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
                sx={{
                  fontWeight: 700,
                  color: "grey.900",
                  mb: 1,
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Project Overview
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Manage and track your projects efficiently
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Toggle Filters">
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  color={showFilters ? "primary" : "default"}
                  sx={{
                    bgcolor: showFilters ? "primary.50" : "transparent",
                    "&:hover": { bgcolor: "primary.100" },
                  }}
                >
                  <FilterIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolr: "primary.50",
                  border: "1px solid",
                  borderColor: "primary.100",
                }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {projectStatusData?.totalProjects || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Projects
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "success.50",
                  border: "1px solid",
                  borderColor: "success.100",
                }}
              >
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
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "info.50",
                  border: "1px solid",
                  borderColor: "info.100",
                }}
              >
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
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  bgcolor: "warning.50",
                  border: "1px solid",
                  borderColor: "warning.100",
                }}
              >
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
              </Paper>
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
              <Grid size={{ xs: 12, md: 4 }}>
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
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Status Filter</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status Filter"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value={0}>All Statuses</MenuItem>
                    <MenuItem value={StatusEnum.ToDo}>To Do</MenuItem>
                    <MenuItem value={StatusEnum.InProgress}>
                      In Progress
                    </MenuItem>
                    <MenuItem value={StatusEnum.Completed}>Completed</MenuItem>
                    <MenuItem value={StatusEnum.Cancelled}>Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
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
          {projectData ? (
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
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
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
                          label={getStatusLabel(project.status)}
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
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 1 }}
                      >
                        {new Date(project.updatedDate).toLocaleDateString(
                          "no-nb",
                        )}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, justifyContent: "flex-end" }}>
                    <Tooltip title="View Details">
                      <IconButton size="small" sx={{ color: "primary.main" }}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Project">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDialog(project);
                        }}
                        sx={{ color: "grey.600" }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ textAlign: "center", mt: 6, py: 6 }}>
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
              {!searchValue && !statusFilter && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                  sx={{ mt: 1 }}
                >
                  Create Project
                </Button>
              )}
            </Box>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default ProjectOverview;
