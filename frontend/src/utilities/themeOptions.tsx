import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          color: "black",
          backgroundColor: "#ebebeb",
          borderRadius: "2em",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          color: "black",
        },
        indicator: {
          backgroundColor: "#3f3d56",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          color: "black",
          fontWeight: 500,
          fontSize: "14px",

          paddingTop: "20px",
          paddingBottom: "12px",
          paddingRight: "16px",
          paddingLeft: "16px",
          "&.Mui-selected": {
            color: "black",
          },
          "& .MuiTab-wrapper": {
            flexDirection: "row",
            gap: "8px",
          },
        },
      },
    },
  },
});
