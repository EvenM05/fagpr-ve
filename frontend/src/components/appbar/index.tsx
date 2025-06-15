import { ArrowDropDownOutlined, MenuOutlined } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  ButtonGroup,
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
          <MenuOutlined />

          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Projex
          </Typography>

          <ButtonGroup sx={{ gap: "1em" }}>
            <Button
              onClick={() => navigate("/Dashboard")}
              sx={{
                float: "right",
                backgroundColor: "transparent",
                gap: "1em",
                color: "white",
                borderBottom: "1px solid",
              }}
            >
              <Typography>Dashboard</Typography>
            </Button>
            <Button
              onClick={() => navigate("/ProjectOverview")}
              sx={{
                float: "right",
                backgroundColor: "transparent",
                gap: "1em",
                color: "white",
                borderBottom: "1px solid",
              }}
            >
              <Typography>Project overview</Typography>
            </Button>
          </ButtonGroup>

          <Button
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
              <MenuItem onClick={() => navigate("/admin/customer")}>
                Customer page
              </MenuItem>
              <MenuItem>Settings</MenuItem>
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
