import { ArrowDropDownOutlined, MenuOutlined } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useGetUserById } from "../../api/hooks";
import {
  removeFromStorage,
  retrieveFromStorage,
} from "../../utilities/localStorage";
import { getRoleName } from "../../utilities/enums/roleEnums";
import { useState } from "react";

export const Appbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const currentUserId = retrieveFromStorage("userId");
  const navigate = useNavigate();

  const { data: userData } = useGetUserById(currentUserId || "");

  const handleLogOut = () => {
    removeFromStorage("token");
    removeFromStorage("userId");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuOutlined />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
            Projex
          </Typography>

          <Button
            id="demo-customized-button"
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
            variant="contained"
            disableElevation
            endIcon={<ArrowDropDownOutlined />}
            onClick={handleClick}
            sx={{
              float: "right",
              backgroundColor: "transparent",
              gap: "1em",
            }}
          >
            <Avatar />
            <Stack alignItems="flex-start">
              <Typography variant="caption">
                {getRoleName(userData?.roleId || 0)}
              </Typography>
              <Typography>{userData?.name}</Typography>
            </Stack>
          </Button>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            slotProps={{
              paper: {
                sx: {
                  width: 280,
                  maxWidth: "100%",
                },
              },
            }}
          >
            <MenuList>
              <MenuItem onClick={() => navigate("/admin/users")}>
                User page
              </MenuItem>
              <MenuItem>2</MenuItem>
              <MenuItem>3</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogOut}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box sx={{ flex: "1", width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
};
