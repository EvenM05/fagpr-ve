import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import {
  PaginationBase,
  ProjectData,
} from "../../utilities/Interfaces/ProjectInterface";

interface ProjectDisplayProps {
  projectData: PaginationBase<ProjectData>;
}

export const ProjectDisplay = (props: ProjectDisplayProps) => {
  const { projectData } = props;

  return (
    <Box sx={{ px: 2, py: 4 }}>
      <Grid container spacing={2}>
        {projectData.items.slice(-4).map((project, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                transition: "transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardHeader
                title={
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {project.name || "Unnamed Customer"}
                  </Typography>
                }
                sx={{ pb: 0 }}
              />

              <CardContent sx={{ pt: 1, pb: 2, flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Typography>{project.name}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
