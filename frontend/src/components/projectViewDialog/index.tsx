import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Chip,
  Button,
  DialogTitle,
  DialogContent,
  Avatar,
  Divider,
  Paper,
  Alert,
  Stack,
  Container,
  IconButton,
  LinearProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import {
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  DateRange as DateRangeIcon,
  Assignment as AssignmentIcon,
  Timeline as TimelineIcon,
  Add,
  KeyboardTab,
  Edit,
  Business,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import {
  getStatusColor,
  getStatusName,
  StatusEnum,
} from "../../utilities/enums/statusEnums";
import {
  useChangeProjectCustomer,
  useGetAllCustomers,
  useGetProjectById,
  usePostResource,
  useUpdateProject,
} from "../../api/hooks";
import {
  CreateResourceData,
  ResourceData,
} from "../../utilities/Interfaces/ResourceInterface";
import {
  EstimateEnum,
  getEstimateName,
} from "../../utilities/enums/estimateEnums";
import {
  GET_PROJECT_BY_ID,
  GET_PROJECT_PAGINATION,
  GET_PROJECT_STATUS_LIST,
} from "../../api/constants";
import { useQueryClient } from "@tanstack/react-query";
import { retrieveFromStorage } from "../../utilities/localStorage";
import {
  UpdateProjectCustomerModel,
  UpdateProjectModel,
} from "../../utilities/Interfaces/ProjectInterface";
import useAuthService from "../../utilities/authService";

interface ProjectViewDialogProps {
  projectId: string;
  handleClose: () => void;
}

export const ProjectViewDialog = (props: ProjectViewDialogProps) => {
  const { projectId, handleClose } = props;
  const { user } = useAuthService();

  const [isCreatingResource, setIsCreatingResource] = useState<boolean>(false);
  const [isEditingDescription, setIsEditingDescription] =
    useState<boolean>(false);
  const [isEditTitle, setIsEditTitle] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [GET_PROJECT_BY_ID],
    });
    queryClient.invalidateQueries({
      queryKey: [GET_PROJECT_PAGINATION],
    });
    queryClient.invalidateQueries({
      queryKey: [GET_PROJECT_STATUS_LIST],
    });
  };

  const { data: projectData } = useGetProjectById(projectId);
  const { data: customerData } = useGetAllCustomers();

  const { mutateAsync: createResource } = usePostResource(onSuccess);
  const { mutateAsync: updateProject } = useUpdateProject(onSuccess);
  const { mutateAsync: addCustomer } = useChangeProjectCustomer(onSuccess);

  const {
    control: resourceControl,
    handleSubmit: resourceHandleSubmit,
    formState: { errors: resourceErrors },
  } = useForm<CreateResourceData>({
    defaultValues: {
      estimateType: EstimateEnum.UX,
      timeHours: 0,
      timeCost: 0,
      projectId: projectId,
    },
  });

  const {
    control: updateProjectControl,
    handleSubmit: updateProjectHandleSubmit,
  } = useForm<UpdateProjectModel>({
    defaultValues: {
      name: projectData?.name,
      description: projectData?.description,
      status: projectData?.status,
      updatedUserId: user?.id,
    },
  });

  const handleSubmitResource = async (data: CreateResourceData) => {
    createResource(data);
    setIsCreatingResource(false);
  };

  const onSubmitProjectData = async (data: UpdateProjectModel) => {
    if (projectData && user) {
      updateProject({
        projectId: projectData.id,
        model: {
          name: data.name,
          description: data.description,
          status: data.status,
          updatedUserId: user.id,
        },
      });
      setIsEditTitle(false);
      setIsEditingDescription(false);
    }
  };

  const handleChangeStatus = () => {
    if (projectData && user) {
      onSubmitProjectData({
        name: projectData.name,
        description: projectData.description,
        status: projectData.status + 1,
        updatedUserId: user.id,
      });
    }
  };

  const handleSetCustomer = (e: SelectChangeEvent) => {
    const value = e.target.value;
    const model: UpdateProjectCustomerModel = {
      customerId: value,
      updatedUserId: user?.id || "",
    };
    addCustomer({ projectId, model });
  };

  const handleEditTitle = () => {
    setIsEditTitle(true);
  };

  const handleEditDescription = () => {
    setIsEditingDescription(true);
  };

  const handleCreateResource = () => {
    setIsCreatingResource(true);
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
        return 0;
      default:
        return 0;
    }
  };

  const formatOrgNumber = (raw: string | number): string =>
    raw
      .toString()
      .replace(/\D/g, "")
      .padStart(9, "0")
      .replace(/(\d{3})(?=\d)/g, "$1 ");

  if (!projectData) {
    return (
      <Container maxWidth="xl" sx={{ pt: 4 }}>
        <Alert severity="error" sx={{ mt: 2 }}>
          Failed to load project data. Please try again.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <DialogTitle sx={{ pb: 2, pr: 6, p: "1em 1.5em" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            {isEditTitle ? (
              <form onSubmit={updateProjectHandleSubmit(onSubmitProjectData)}>
                <Stack direction="row" gap="1em" sx={{ pb: "1em" }}>
                  <Controller
                    name="name"
                    control={updateProjectControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Project title"
                        variant="filled"
                        defaultValue={projectData.name}
                      />
                    )}
                  />
                  <Button onClick={() => setIsEditTitle(false)}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </Stack>
              </form>
            ) : (
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, mb: 1 }}
                onClick={handleEditTitle}
              >
                {projectData.name}
              </Typography>
            )}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                label={getStatusName(projectData.status)}
                color={getStatusColor(projectData.status)}
                sx={{ fontWeight: 500 }}
              />
              <Typography variant="body2" color="text.secondary">
                {new Date(projectData.updatedDate).toLocaleDateString("no-nb")}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              bgcolor: "grey.100",
              "&:hover": { bgcolor: "grey.200" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, mb: 3, bgcolor: "grey.50", borderRadius: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <AssignmentIcon sx={{ mr: 1, color: "primary.main" }} />
                  Project Description
                </Typography>
                <Button
                  startIcon={<Edit />}
                  onClick={handleEditDescription}
                  sx={{ borderRadius: "1em", bgcolor: "#ebebeb" }}
                >
                  Change description
                </Button>
              </Stack>
              {isEditingDescription ? (
                <form onSubmit={updateProjectHandleSubmit(onSubmitProjectData)}>
                  <Controller
                    name="description"
                    control={updateProjectControl}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        multiline
                        rows={4}
                        defaultValue={projectData.description}
                        variant="filled"
                        fullWidth
                      />
                    )}
                  />
                  <Stack
                    direction="row"
                    justifyContent="end"
                    mt="1em"
                    gap="1em"
                  >
                    <Button onClick={() => setIsEditingDescription(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </Stack>
                </form>
              ) : (
                <Typography
                  variant="body1"
                  sx={{ lineHeight: 1.6, color: "text.secondary" }}
                >
                  {projectData.description}
                </Typography>
              )}
            </Paper>

            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={"1em"}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TimelineIcon sx={{ mr: 1, color: "primary.main" }} />
                  Project Progress
                </Typography>
                <Button
                  disabled={
                    projectData.status === StatusEnum.Cancelled ||
                    projectData.status === StatusEnum.Completed
                  }
                  startIcon={<KeyboardTab />}
                  onClick={handleChangeStatus}
                  sx={{ borderRadius: "1em", bgcolor: "#ebebeb" }}
                >
                  Change status
                </Button>
              </Stack>
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Progress
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {getProgressValue(projectData.status)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getProgressValue(projectData.status)}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "grey.200",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
              <Stack direction="row" gap="5px" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Current Status:
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {getStatusName(projectData.status)}
                </Typography>
              </Stack>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={"1em"}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Project Resources
                </Typography>
                <Button
                  startIcon={<Add />}
                  onClick={handleCreateResource}
                  sx={{ borderRadius: "1em", bgcolor: "#ebebeb" }}
                >
                  Create resource
                </Button>
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {isCreatingResource && (
                  <form onSubmit={resourceHandleSubmit(handleSubmitResource)}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "grey.50",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Controller
                          name="estimateType"
                          control={resourceControl}
                          render={({ field }) => (
                            <FormControl
                              variant="filled"
                              sx={{ m: 1, minWidth: "10em" }}
                            >
                              <InputLabel id="demo-simple-select-filled-label">
                                Estimate type
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                {...field}
                              >
                                <MenuItem value={EstimateEnum.ProjectManagment}>
                                  {getEstimateName(
                                    EstimateEnum.ProjectManagment,
                                  )}
                                </MenuItem>
                                <MenuItem value={EstimateEnum.IsDevelopment}>
                                  {getEstimateName(EstimateEnum.IsDevelopment)}
                                </MenuItem>
                                <MenuItem value={EstimateEnum.UX}>
                                  {getEstimateName(EstimateEnum.UX)}
                                </MenuItem>
                                <MenuItem value={EstimateEnum.Testing}>
                                  {getEstimateName(EstimateEnum.Testing)}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          )}
                        />
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <TimeIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              color: "primary.main",
                            }}
                          />
                          <Controller
                            name="timeHours"
                            control={resourceControl}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Time estimate"
                                variant="filled"
                                sx={{ width: "7em" }}
                              />
                            )}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <MoneyIcon
                            fontSize="small"
                            sx={{
                              mr: 0.5,
                              color: "success.main",
                            }}
                          />
                          <Controller
                            name="timeCost"
                            control={resourceControl}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Cost estimate"
                                variant="filled"
                                sx={{ width: "7em" }}
                              />
                            )}
                          />
                        </Box>
                        <Box>
                          <Button onClick={() => setIsCreatingResource(false)}>
                            <Typography>cancel</Typography>
                          </Button>

                          <Button type="submit">
                            <Typography>save</Typography>
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
                  </form>
                )}
                {projectData.resources ? (
                  projectData.resources.map((resource, index) => (
                    <Box
                      key={resource.id || index}
                      sx={{
                        p: 2,
                        bgcolor: "grey.50",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "grey.200",
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {getEstimateName(resource.estimateType)}
                          </Typography>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <TimeIcon
                              fontSize="small"
                              sx={{
                                mr: 0.5,
                                color: "primary.main",
                              }}
                            />
                            <Typography variant="body2">
                              {resource.timeHours}h
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid size={{ xs: 6, sm: 3 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <MoneyIcon
                              fontSize="small"
                              sx={{
                                mr: 0.5,
                                color: "success.main",
                              }}
                            />
                            <Typography variant="body2">
                              {resource.totalCost.toLocaleString()}
                              kr
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  ))
                ) : (
                  <></>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "primary.50",
                  borderRadius: 2,
                }}
              >
                <TimeIcon sx={{ fontSize: 32, color: "primary.main", mb: 1 }} />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  {calculateTotalHours(projectData.resources)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Hours
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "success.50",
                  borderRadius: 2,
                }}
              >
                <MoneyIcon
                  sx={{ fontSize: 32, color: "success.main", mb: 1 }}
                />
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, color: "success.main" }}
                >
                  {calculateTotalCost(projectData.resources).toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Cost (kr)
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  textAlign: "center",
                  bgcolor: "info.50",
                  borderRadius: 2,
                }}
              >
                {projectData.customer ? (
                  <Stack direction="column" alignItems="center">
                    <Business sx={{ fontSize: 32, color: "#222222", mb: 1 }} />
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#222222" }}
                    >
                      {projectData.customer.name}
                    </Typography>
                    <Stack
                      justifyContent="space-around"
                      direction="row"
                      width="100%"
                    >
                      <Typography variant="body2" color="text.secondary">
                        {formatOrgNumber(
                          projectData.customer.organizationNumber,
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {projectData.customer.contactMail}
                      </Typography>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack direction="column" alignItems="center">
                    <Business sx={{ fontSize: 32, color: "#222222", mb: 1 }} />
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "#222222" }}
                    >
                      Customer
                    </Typography>
                    <FormControl sx={{ width: "75%" }}>
                      <InputLabel>Add customer</InputLabel>
                      <Select
                        id="demo-simple-select"
                        label="Age"
                        onChange={handleSetCustomer}
                      >
                        {customerData?.map((customer) => (
                          <MenuItem value={customer.id}>
                            {customer.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Stack>
                )}
              </Paper>
            </Stack>

            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PersonIcon sx={{ mr: 1, color: "primary.main" }} />
                Project Team
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Created By
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      bgcolor: "primary.main",
                      fontSize: "0.875rem",
                    }}
                  >
                    {projectData.createdUser.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {projectData.createdUser.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Project Creator
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Last Updated By
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      mr: 1.5,
                      bgcolor: "secondary.main",
                      fontSize: "0.875rem",
                    }}
                  >
                    {projectData.updatedUser.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {projectData.updatedUser.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last Editor
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <DateRangeIcon sx={{ mr: 1, color: "primary.main" }} />
                Timeline
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {new Date(projectData.createdDate).toLocaleDateString(
                    "no-nb",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {new Date(projectData.updatedDate).toLocaleDateString(
                    "no-nb",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogContent sx={{ p: 3, pt: 2, bgcolor: "grey.50" }} />
    </>
  );
};
