import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Fade,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../api/hooks";
import { LoginModel } from "../utilities/Interfaces/LoginInterface";
import { saveToStorage } from "../utilities/localStorage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#f43f5e",
    },
    background: {
      default: "#f8fafc",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginErrors, setLoginErrors] = useState(false);
  const navigate = useNavigate();

  const { mutateAsync: userLogin } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginModel>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginModel) => {
    setIsLoading(true);
    const loginResponse = await userLogin(data);

    console.log("login response: ", loginResponse);

    if (loginResponse?.status === 200) {
      saveToStorage("token", loginResponse.data.token);
      saveToStorage("userId", loginResponse.data.userId);
      navigate("/Dashboard");
    } else if (loginResponse?.status === 401) {
      setLoginErrors(true);
      console.error("Unautherized");
    } else {
      console.error("Error occured while logging in");
    }
    setIsLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Fade in timeout={800}>
            <Card
              elevation={24}
              sx={{
                backdropFilter: "blur(10px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box textAlign="center" mb={4}>
                  <Typography
                    variant="h4"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 1 }}
                  >
                    Login
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Sign in to your account to continue
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Please enter a valid email",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email Address"
                        type="email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email color="action" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Password is required",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        sx={{ mb: 3 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={isLoading}
                    sx={{
                      mb: 2,
                      py: 1.5,
                      fontSize: "1.1rem",
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>

                  <Stack direction="row" justifyContent="space-evenly">
                    <Button sx={{ textTransform: "none" }}>
                      <Typography variant="body2" color="primary">
                        Forgot your password?
                      </Typography>
                    </Button>

                    <Button sx={{ textTransform: "none" }}>
                      <Typography
                        onClick={() => navigate("/register")}
                        variant="body2"
                        color="primary"
                      >
                        Don't have an account?
                      </Typography>
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
