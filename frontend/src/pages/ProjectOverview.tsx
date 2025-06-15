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
  IconButton,
  Fab,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useGetProjectPagination } from "../api/hooks";
import { StatusEnum } from "../utilities/enums/statusEnums";
import { RoleEnum } from "../components/createUserDialog";
import { EstimateEnum } from "../utilities/enums/estimateEnums";
import { ProjectData } from "../utilities/Interfaces/ProjectInterface";
import { ResourceData } from "../utilities/Interfaces/ResourceInterface";

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
      return "primary";
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

const getEstimateTypeLabel = (type: EstimateEnum): string => {
  switch (type) {
    case EstimateEnum.UX:
      return "UX Design";
    case EstimateEnum.IsDevelopment:
      return "Development";
    case EstimateEnum.ProjectManagment:
      return "Project Management";
    case EstimateEnum.Testing:
      return "Testing";
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

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const { data: projectData, isLoading: projectLoading } =
    useGetProjectPagination(
      searchValue,
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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProject(null);
    setIsEditing(false);
    reset();
  };

  const onSubmit = (data: ProjectFormData) => {
    if (isEditing && selectedProject) {
      console.log("edit", data);
    } else {
      console.log("create", data);
    }
    handleCloseDialog();
  };

  const calculateTotalCost = (resources: ResourceData[]): number => {
    return resources.reduce((total, resource) => total + resource.totalCost, 0);
  };

  const calculateTotalHours = (resources: ResourceData[]): number => {
    return resources.reduce((total, resource) => total + resource.timeHours, 0);
  };

  if (!projectData) {
    return (
      <Box>
        <Typography>Error</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Project Overview
      </Typography>

      {/* Filter Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status Filter</InputLabel>
          <Select
            value={statusFilter}
            label="Status Filter"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value={StatusEnum.ToDo}>To Do</MenuItem>
            <MenuItem value={StatusEnum.InProgress}>In Progress</MenuItem>
            <MenuItem value={StatusEnum.Completed}>Completed</MenuItem>
            <MenuItem value={StatusEnum.Cancelled}>Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Project Cards */}
      <Grid container spacing={3}>
        {projectData.items.map((project) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={project.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{ fontWeight: "bold" }}
                  >
                    {project.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(project)}
                    sx={{ ml: 1 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {project.description}
                </Typography>

                <Chip
                  label={getStatusLabel(project.status)}
                  color={getStatusColor(project.status)}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }} />

                {/* Project Stats */}
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
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {calculateTotalHours(project.resources)}h
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MoneyIcon
                      fontSize="small"
                      sx={{ mr: 1, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      ${calculateTotalCost(project.resources).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    sx={{ width: 24, height: 24, mr: 1, fontSize: "0.75rem" }}
                  >
                    {project.createdUser.name.charAt(0)}
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    Created by {project.createdUser.name}
                  </Typography>
                </Box>

                <Typography variant="caption" color="text.secondary">
                  Last updated:
                  {new Date(project.updatedDate).toLocaleDateString("no-nb")}
                </Typography>

                {project.resources.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Resources:
                    </Typography>
                    <List dense sx={{ py: 0 }}>
                      {project.resources.map((resource) => (
                        <ListItem key={resource.id} sx={{ px: 0, py: 0.5 }}>
                          <ListItemText
                            primary={getEstimateTypeLabel(
                              resource.estimateType,
                            )}
                            secondary={`${
                              resource.timeHours
                            }h - $${resource.totalCost.toLocaleString()}`}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondaryTypographyProps={{ variant: "caption" }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {projectData.totalItems === 0 && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Alert severity="info">
            No projects found matching the current filter.
          </Alert>
        </Box>
      )}

      <Fab
        color="primary"
        aria-label="add project"
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {isEditing ? "Edit Project" : "Add New Project"}
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
              <Controller
                name="name"
                control={control}
                rules={{ required: "Project name is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Project Name"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              <Controller
                name="description"
                control={control}
                rules={{ required: "Description is required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Description"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select {...field} label="Status">
                      <MenuItem value={StatusEnum.ToDo}>To Do</MenuItem>
                      <MenuItem value={StatusEnum.InProgress}>
                        In Progress
                      </MenuItem>
                      <MenuItem value={StatusEnum.Completed}>
                        Completed
                      </MenuItem>
                      <MenuItem value={StatusEnum.Cancelled}>
                        Cancelled
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              {/* <Controller
                name="createdUserId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Created By</InputLabel>
                    <Select {...field} label="Created By">
                      {userData.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name} ({getRoleLabel(user.roleId)})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              /> */}

              {/* <Controller
                name="updatedUserId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel>Updated By</InputLabel>
                    <Select {...field} label="Updated By">
                      {sampleUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.name} ({getRoleLabel(user.roleId)})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              /> */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default ProjectOverview;
