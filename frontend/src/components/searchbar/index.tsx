import { Search } from "@mui/icons-material";
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";

export const Searchbar = () => {
  const [selectedFilter, setSelectedFilter] = useState<number>(0);
  const phoneView = useMediaQuery("(max-width: 830px)");

  return (
    <Stack
      direction={!phoneView ? "row" : "column"}
      sx={{ width: "100%", mb: "2em" }}
    >
      <TextField
        sx={{
          p: "10px 15px",
          color: "black",
          backgroundColor: "lightgray",
          borderRadius: "28px",
          width: !phoneView ? "40%" : "100%",
        }}
        variant="standard"
        placeholder="Search"
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <Stack direction="row">
        <Button
          onClick={() => setSelectedFilter(0)}
          sx={{
            m: "0.5em ",
            width: "13em",
            alignSelf: "center",
            border: selectedFilter === 0 ? "none" : "1px solid",
            borderColor: "#e4e1e7",
            backgroundColor: selectedFilter === 0 ? "lightgray" : "none",
          }}
        >
          {"RecentChoice"}
        </Button>
        <Button
          onClick={() => setSelectedFilter(1)}
          sx={{
            m: "0.5em ",
            width: "13em",
            alignSelf: "center",
            border: selectedFilter === 1 ? "none" : "1px solid",
            borderColor: "#e4e1e7",
            backgroundColor: selectedFilter === 1 ? "lightgray" : "none",
          }}
        >
          {"CreatedByYouChoice"}
        </Button>
        <Button
          onClick={() => setSelectedFilter(2)}
          sx={{
            m: "0.5em ",
            width: "13em",
            alignSelf: "center",
            border: selectedFilter === 2 ? "none" : "1px solid",
            borderColor: "#e4e1e7",
            backgroundColor: selectedFilter === 2 ? "lightgray" : "none",
          }}
        >
          {"AssignedToYouChoice"}
        </Button>
      </Stack>
    </Stack>
  );
};
