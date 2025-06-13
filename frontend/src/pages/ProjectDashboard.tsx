import { Add, YouTube } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useGetProjectPagination, useGetProjectStatusList } from "../api/hooks";
import { Searchbar } from "../components/searchbar";
import { ProjectDisplay } from "../components/ProjectDisplay";
import { useState } from "react";

export default function ProjectDashboard() {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [sortOrder, setSortOrder] = useState("desc");
  const [status, setStatus] = useState(0);
  const [searchValue, setSearchValue] = useState("");

  const { data: projectStatusList, isLoading: projectStatusListLoading } =
    useGetProjectStatusList();

  const { data: projectData, isLoading: projectLoading } =
    useGetProjectPagination(searchValue, page, rowsPerPage, sortOrder, status);

  if (projectStatusListLoading || projectLoading) {
    return (
      <Box>
        <Typography>Loading</Typography>
      </Box>
    );
  }

  if (!projectStatusList || !projectData) {
    return (
      <Box>
        <Typography>Error</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100%", p: "4em" }}>
      <Stack direction="row" sx={{ gap: "2em" }}>
        <Box
          sx={{
            width: "65%",
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="h4">Projects</Typography>
            <Button startIcon={<Add />} sx={{ textTransform: "none" }}>
              Create project
            </Button>
          </Stack>

          <Grid container spacing={2}>
            <Grid
              size={{ xs: 6 }}
              sx={{
                border: "1px solid #e4e1e7",
                borderRadius: "10px",
                p: "1em",
              }}
            >
              <Stack direction="row" gap="1em" alignItems="center">
                <Avatar sx={{ backgroundColor: "#eceff1", color: "#263238" }}>
                  {projectStatusList.toDoProjects}
                </Avatar>
                <Typography variant="h6">Not started</Typography>
              </Stack>
            </Grid>
            <Grid
              size={{ xs: 6 }}
              sx={{
                border: "1px solid #e4e1e7",
                borderRadius: "10px",
                p: "1em",
              }}
            >
              <Stack direction="row" gap="1em" alignItems="center">
                <Avatar sx={{ backgroundColor: "#e8f5e9", color: "#1b5e20" }}>
                  {projectStatusList.startedProjects}
                </Avatar>
                <Typography variant="h6">In progress</Typography>
              </Stack>
            </Grid>
            <Grid
              size={{ xs: 6 }}
              sx={{
                border: "1px solid #e4e1e7",
                borderRadius: "10px",
                p: "1em",
              }}
            >
              <Stack direction="row" gap="1em" alignItems="center">
                <Avatar sx={{ backgroundColor: "#e1f5fe", color: "#1e87c5" }}>
                  {projectStatusList.completedProjects}
                </Avatar>
                <Typography variant="h6">Finished</Typography>
              </Stack>
            </Grid>
            <Grid
              size={{ xs: 6 }}
              sx={{
                border: "1px solid #e4e1e7",
                borderRadius: "10px",
                p: "1em",
              }}
            >
              <Stack direction="row" gap="1em" alignItems="center">
                <Avatar sx={{ backgroundColor: "#feebee", color: "#c03636" }}>
                  {projectStatusList.cancelledProjects}
                </Avatar>
                <Typography variant="h6">Cancelled</Typography>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            display: "flex",
            width: "35%",
          }}
        >
          <Typography>Kunder</Typography>
        </Box>
      </Stack>

      <Divider sx={{ m: "4em 0em" }} />

      <Stack direction="column" alignItems="start" sx={{ width: "100%" }}>
        <Box sx={{ width: "100%" }}>
          <Box>
            <Searchbar />
          </Box>
        </Box>
        <Box sx={{ width: "100%" }}>
          <ProjectDisplay projectData={projectData} />
        </Box>
      </Stack>
    </Box>
  );
}
