import { ArrowDropDownOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import {
  removeFromStorage,
  retrieveFromStorage,
} from "../../utilities/localStorage";
import { getRoleName } from "../../utilities/enums/roleEnums";
import { useState } from "react";
import img from "../../assets/logo.png";
import useAuthService from "../../utilities/authService";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export const Appbar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const token = retrieveFromStorage("token");
  const navigate = useNavigate();
  const { user, isAdmin, isPM } = useAuthService();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    removeFromStorage("token");
    removeFromStorage("userId");
    navigate("/login");
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  if (!token) {
    navigate("/login");
  }

  if (!user) {
    <Box>
      <CircularProgress />
    </Box>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack
        position="fixed"
        direction="row"
        sx={{
          justifyContent: "space-between",
          bgcolor: "#ebebeb",
          padding: "0em 1em",
          width: "100%",
        }}
      >
        <Button startIcon={<img src={img} alt="logo" style={{ height: 30 }} />}>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Projex
          </Typography>
        </Button>

        <Stack direction="row">
          <Tabs
            value={
              ["/Dashboard", "/ProjectOverview"].includes(location.pathname)
                ? location.pathname
                : false
            }
            onChange={handleChange}
          >
            <Tab label="Dashboard" value="/Dashboard" {...a11yProps(0)} />
            <Tab
              label="Project overview"
              value="/ProjectOverview"
              {...a11yProps(1)}
            />
          </Tabs>

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
                {getRoleName(user?.roleId || 0)}
              </Typography>
              <Typography>{user?.name}</Typography>
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
              {isAdmin() && (
                <MenuItem onClick={() => navigate("/admin/users")}>
                  User page
                </MenuItem>
              )}
              {(isAdmin() || isPM()) && (
                <MenuItem onClick={() => navigate("/admin/customer")}>
                  Customer page
                </MenuItem>
              )}
              <MenuItem>Settings</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogOut}>Log out</MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Stack>
      <Box sx={{ flex: "1", width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
};
