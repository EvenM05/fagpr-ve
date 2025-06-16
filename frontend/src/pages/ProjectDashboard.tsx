import { useState, useMemo } from "react";
import {
  Add,
  TrendingUp,
  Schedule,
  AttachMoney,
  Assignment,
  MoreVert,
  AccessTime,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { PieChart, LineChart, BarChart, SparkLineChart } from "@mui/x-charts";
import { StatusEnum } from "../utilities/enums/statusEnums";
import { EstimateEnum } from "../utilities/enums/estimateEnums";
import {
  useGetProjectMonthlyData,
  useGetProjectPagination,
  useGetProjectStatusList,
} from "../api/hooks";
import { ResourceData } from "../utilities/Interfaces/ResourceInterface";

const statusColors = {
  [StatusEnum.ToDo]: { bg: "#eceff1", color: "#263238", label: "Not Started" },
  [StatusEnum.InProgress]: {
    bg: "#e8f5e9",
    color: "#1b5e20",
    label: "In Progress",
  },
  [StatusEnum.Completed]: {
    bg: "#e1f5fe",
    color: "#0277bd",
    label: "Completed",
  },
  [StatusEnum.Cancelled]: {
    bg: "#ffebee",
    color: "#c62828",
    label: "Cancelled",
  },
};

const estimateTypeLabels = {
  [EstimateEnum.UX]: "UX Design",
  [EstimateEnum.IsDevelopment]: "Development",
  [EstimateEnum.ProjectManagment]: "Project Management",
  [EstimateEnum.Testing]: "Testing",
};

export default function ProjectDashboard() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { data: projectStatusList, isLoading: projectStatusListLoading } =
    useGetProjectStatusList();

  const { data: projectData, isLoading: projectLoading } =
    useGetProjectPagination("", 1, 100, "desc", 0);

  const { data: monthlyData, isLoading: monthlyDataLoading } =
    useGetProjectMonthlyData();

  const metrics = useMemo(() => {
    if (projectData) {
      const totalProjects = projectData?.totalItems;
      const statusCounts = projectData?.items.reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1;
        return acc;
      }, {} as Record<StatusEnum, number>);

      const totalBudget = projectData?.items.reduce(
        (acc, project) =>
          acc +
          project.resources.reduce(
            (sum, resource) => sum + resource.totalCost,
            0,
          ),
        0,
      );

      const totalHours = projectData?.items.reduce(
        (acc, project) =>
          acc +
          project.resources.reduce(
            (sum, resource) => sum + resource.timeHours,
            0,
          ),
        0,
      );

      const activeProjects = statusCounts[StatusEnum.InProgress];
      const completionRate =
        totalProjects > 0
          ? ((statusCounts[StatusEnum.Completed] || 0) / totalProjects) * 100
          : 0;

      return {
        totalProjects,
        statusCounts,
        totalBudget,
        totalHours,
        activeProjects,
        completionRate,
      };
    } else {
      return {
        totalProjects: 0,
        statusCounts: 0,
        totalBudget: 0,
        totalHours: 0,
        activeProjects: 0,
        completionRate: 0,
      };
    }
  }, [projectData]);

  if (projectStatusListLoading || projectLoading || monthlyDataLoading) {
    return (
      <Box>
        <Typography>Loading</Typography>
      </Box>
    );
  }

  if (!projectStatusList || !projectData || !monthlyData) {
    return (
      <Box>
        <Typography>Error</Typography>
      </Box>
    );
  }

  const statusPieData = Object.entries(metrics.statusCounts).map(
    ([status, count]) => ({
      id: parseInt(status),
      value: count,
      label: statusColors[parseInt(status) as StatusEnum].label,
      color: statusColors[parseInt(status) as StatusEnum].color,
    }),
  );

  const resourceDistribution = projectData.items
    .flatMap((p) => p.resources)
    .reduce((acc, resource) => {
      const type = estimateTypeLabels[resource.estimateType];
      acc[type] = (acc[type] || 0) + resource.totalCost;
      return acc;
    }, {} as Record<string, number>);

  const resourceBarData = Object.entries(resourceDistribution).map(
    ([type, cost]) => ({
      type,
      cost,
    }),
  );

  const projectProgressData = [65, 78, 45, 89, 92, 76, 68];

  const recentProjects = projectData.items
    .sort(
      (a, b) =>
        new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime(),
    )
    .slice(0, 5);

  const calculateTotalHours = (resources: ResourceData[]): number => {
    return resources.reduce((total, resource) => total + resource.timeHours, 0);
  };

  const calculateTotalCost = (resources: ResourceData[]): number => {
    return resources.reduce((total, resource) => total + resource.totalCost, 0);
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 3,
        paddingTop: "5em",
      }}
    >
      <Box sx={{ maxWidth: "1400px", mx: "auto" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: "white", mb: 1 }}
            >
              Project Dashboard
            </Typography>
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)" }}>
              Monitor your projects and track progress
            </Typography>
          </Box>
        </Stack>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                height: "10em",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">
                      Total Projects
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#1976d2" }}
                    >
                      {metrics.totalProjects}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}>
                    <Assignment />
                  </Avatar>
                </Stack>
                <SparkLineChart
                  data={projectProgressData}
                  height={60}
                  color="#1976d2"
                  margin={{ top: 10, bottom: 10, left: 0, right: 0 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                height: "10em",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">
                      Active Projects
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#2e7d32" }}
                    >
                      {metrics.activeProjects}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "#e8f5e9", color: "#2e7d32" }}>
                    <TrendingUp />
                  </Avatar>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={
                    (100 * projectStatusList.startedProjects) /
                    projectData.totalItems
                  }
                  sx={{ mt: 2, height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                height: "10em",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="column" alignItems="start">
                    <Typography color="textSecondary" variant="subtitle2">
                      Total Budget
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#ed6c02" }}
                    >
                      {metrics.totalBudget.toFixed(0)} kr
                    </Typography>
                  </Stack>
                  <Avatar sx={{ bgcolor: "#fff3e0", color: "#ed6c02" }}>
                    <AttachMoney />
                  </Avatar>
                </Stack>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 1 }}
                ></Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                height: "10em",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography color="textSecondary" variant="subtitle2">
                      Completion Rate
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#9c27b0" }}
                    >
                      {metrics.completionRate.toFixed(0)}%
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: "#f3e5f5", color: "#9c27b0" }}>
                    <Schedule />
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                height: "400px",
              }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Monthly Project Trends
                </Typography>
                <LineChart
                  height={320}
                  xAxis={[
                    {
                      scaleType: "point",
                      data: monthlyData.map((d) => d.month),
                    },
                  ]}
                  series={[
                    {
                      data: monthlyData.map((d) => d.projectCount),
                      label: "Projects",
                      color: "#1976d2",
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                height: "400px",
              }}
            >
              <CardContent sx={{ height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Project Status Distribution
                </Typography>
                <PieChart
                  series={[
                    {
                      data: statusPieData,
                      highlightScope: { fade: "global", highlight: "item" },
                      faded: {
                        innerRadius: 30,
                        additionalRadius: -30,
                        color: "gray",
                      },
                    },
                  ]}
                  height={320}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                height: "29em",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Resource Cost Distribution
                </Typography>
                <BarChart
                  height={300}
                  xAxis={[
                    {
                      scaleType: "band",
                      data: resourceBarData.map((item) => item.type),
                    },
                  ]}
                  series={[
                    {
                      data: resourceBarData.map((item) => item.cost),
                      label: "Cost (kr)",
                      color: "#2e7d32",
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              sx={{
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                height: "29em",
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Recent Projects
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                  >
                    <MoreVert />
                  </IconButton>
                </Stack>

                <Stack spacing={2}>
                  {recentProjects.slice(-3).map((project) => (
                    <Paper
                      key={project.id}
                      sx={{
                        p: 2,
                        border: "1px solid #e0e0e0",
                        "&:hover": { boxShadow: 2 },
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            {project.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{ mb: 1 }}
                          >
                            {project.description}
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent="space-around"
                            spacing={1}
                          >
                            <Stack
                              direction="row"
                              alignItems="center"
                              justifyContent="space-between"
                              spacing={1}
                            >
                              <Chip
                                label={statusColors[project.status].label}
                                size="small"
                                sx={{
                                  bgcolor: statusColors[project.status].bg,
                                  color: statusColors[project.status].color,
                                  fontWeight: 600,
                                }}
                              />
                              <Tooltip title={project.updatedUser.name}>
                                <Avatar
                                  sx={{
                                    width: 24,
                                    height: 24,
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {project.updatedUser.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </Avatar>
                              </Tooltip>
                            </Stack>

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <AccessTime
                                  fontSize="small"
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {calculateTotalHours(project.resources)}h
                                </Typography>
                              </Box>
                              <Box
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <AttachMoney
                                  fontSize="small"
                                  sx={{ mr: 1, color: "text.secondary" }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {calculateTotalCost(
                                    project.resources,
                                  ).toLocaleString()}
                                  kr
                                </Typography>
                              </Box>
                            </Box>
                          </Stack>
                        </Box>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={() => setAnchorEl(null)}>
                    View All Projects
                  </MenuItem>
                  <MenuItem onClick={() => setAnchorEl(null)}>
                    Export Data
                  </MenuItem>
                  <MenuItem onClick={() => setAnchorEl(null)}>
                    Settings
                  </MenuItem>
                </Menu>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
