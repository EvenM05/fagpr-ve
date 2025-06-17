import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectOverview from "./pages/ProjectOverview";
import LoginPage from "./pages/LoginPage";
import "./App.css";
import { Appbar } from "./components/appbar";
import { ThemeProvider } from "@mui/material";
import { theme } from "./utilities/themeOptions";
import { ProtectedRoute } from "./utilities/protectedRoute";
import { UserOverview } from "./pages/UserOverview";
import CustomerOverview from "./pages/CustomerOverview";
import { RoleEnum } from "./utilities/enums/roleEnums";

export default function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Appbar />,
      children: [
        {
          path: "dashboard",
          element: <ProjectDashboard />,
        },
        {
          path: "projectoverview",
          element: <ProjectOverview />,
        },
        {
          path: "admin/users",
          element: (
            <ProtectedRoute roles={[RoleEnum.Admin]}>
              <UserOverview />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/customer",
          element: (
            <ProtectedRoute roles={[RoleEnum.Admin, RoleEnum.ProjectManager]}>
              <CustomerOverview />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
