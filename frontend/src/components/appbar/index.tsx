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
  Tab,
  Tabs,
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
import img from "../../assets/logo.png";

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

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Stack
        position="fixed"
        direction="row"
        sx={{
          justifyContent: "space-between",
          bgcolor: "#f3edf7",
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
        </Stack>
      </Stack>
      <Box sx={{ flex: "1", width: "100%" }}>
        <Outlet />
      </Box>
    </Box>
  );
};
