import { Box, Typography } from "@mui/material";
import img from "../assets/loginBackground.jpg";

export default function LoginPage() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${img})`,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "4em",
          maxHeight: "30em",
          maxWidth: "30em",
          backgroundColor: "white",
          gap: "1.5em",
        }}
      >
        <form></form>
      </Box>
    </Box>
  );
}
