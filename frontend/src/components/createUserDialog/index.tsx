import { Close } from "@mui/icons-material";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { getRoleName } from "../../utilities/enums/roleEnums";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import { UserData } from "../../utilities/Interfaces/UserInterfaces";

// Enums and interfaces
export enum RoleEnum {
  User,
  ProjectManager,
  Admin,
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId: RoleEnum;
}

interface CreateUserDialogProps {
  handleClose: () => void;
  createUser: UseMutateAsyncFunction<UserData, Error, CreateUserData, unknown>;
}

export const CreateUserDialog = (props: CreateUserDialogProps) => {
  const { createUser, handleClose } = props;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: RoleEnum.User,
    },
  });

  const handleFormSubmit = async (data: CreateUserData) => {
    createUser(data);
  };

  const handleDialogClose = () => {
    reset();
    handleClose();
  };

  return (
    <>
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Create New User
        </Typography>
        <IconButton onClick={handleDialogClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email Address"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />

            <Controller
              name="roleId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.roleId}>
                  <InputLabel>Role</InputLabel>
                  <Select {...field} label="Role">
                    <MenuItem value={RoleEnum.User}>
                      {getRoleName(RoleEnum.User)}
                    </MenuItem>
                    <MenuItem value={RoleEnum.ProjectManager}>
                      {getRoleName(RoleEnum.ProjectManager)}
                    </MenuItem>
                    <MenuItem value={RoleEnum.Admin}>
                      {getRoleName(RoleEnum.Admin)}
                    </MenuItem>
                  </Select>
                  {errors.roleId && (
                    <FormHelperText>{errors.roleId.message}</FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting ? "Creating..." : "Create User"}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};
