import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useGetAllUsers } from "../api/hooks";

export interface UserData {
  id: string;
  name: string;
  email: string;
  roleId: RoleEnum;
}

export enum RoleEnum {
  User,
  ProjectManager,
  Admin,
}

const getRoleLabel = (role: RoleEnum): string => {
  switch (role) {
    case RoleEnum.User:
      return "User";
    case RoleEnum.ProjectManager:
      return "Project Manager";
    case RoleEnum.Admin:
      return "Admin";
    default:
      return "Unknown";
  }
};

const getRoleColor = (
  role: RoleEnum,
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (role) {
    case RoleEnum.User:
      return "default";
    case RoleEnum.ProjectManager:
      return "primary";
    case RoleEnum.Admin:
      return "error";
    default:
      return "default";
  }
};

export const UserOverview = () => {
  const { data: userData, isLoading, error } = useGetAllUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleEnum | "all">("all");

  // Filter and search users
  const filteredUsers = useMemo(() => {
    if (!userData) return [];

    return userData.filter((user: UserData) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.roleId === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [userData, searchTerm, roleFilter]);

  // Calculate statistics
  const userStats = useMemo(() => {
    if (!userData) return { total: 0, users: 0, projectManagers: 0, admins: 0 };

    return {
      total: userData.length,
      users: userData.filter((u: UserData) => u.roleId === RoleEnum.User)
        .length,
      projectManagers: userData.filter(
        (u: UserData) => u.roleId === RoleEnum.ProjectManager,
      ).length,
      admins: userData.filter((u: UserData) => u.roleId === RoleEnum.Admin)
        .length,
    };
  }, [userData]);

  const handleEditUser = (userId: string) => {
    // Implement edit functionality
    console.log("Edit user:", userId);
  };

  const handleDeleteUser = (userId: string) => {
    // Implement delete functionality
    console.log("Delete user:", userId);
  };

  const handleAddUser = () => {
    // Implement add user functionality
    console.log("Add new user");
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load user data. Please try again later.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box
        mb={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Tooltip title="Add New User">
          <IconButton
            color="primary"
            onClick={handleAddUser}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <PersonAddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4">{userStats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Regular Users
              </Typography>
              <Typography variant="h4" color="text.secondary">
                {userStats.users}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Project Managers
              </Typography>
              <Typography variant="h4" color="primary">
                {userStats.projectManagers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Administrators
              </Typography>
              <Typography variant="h4" color="error">
                {userStats.admins}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box mb={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Search users"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as RoleEnum | "all")
                }
                label="Filter by Role"
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value={RoleEnum.User}>Users</MenuItem>
                <MenuItem value={RoleEnum.ProjectManager}>
                  Project Managers
                </MenuItem>
                <MenuItem value={RoleEnum.Admin}>Administrators</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>
              <TableCell>
                <strong>Email</strong>
              </TableCell>
              <TableCell>
                <strong>Role</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body1" color="textSecondary">
                    {searchTerm || roleFilter !== "all"
                      ? "No users match your search criteria."
                      : "No users found."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: UserData) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {user.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="textSecondary">
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleLabel(user.roleId)}
                      color={getRoleColor(user.roleId)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit User">
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user.id)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete User">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Results Summary */}
      {filteredUsers.length > 0 && (
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary">
            Showing {filteredUsers.length} of {userData?.length || 0} users
          </Typography>
        </Box>
      )}
    </Box>
  );
};
