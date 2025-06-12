import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectOverview from "./pages/ProjectOverview";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      children: [
        {
          path: "/dashboard",
          element: <ProjectDashboard />,
        },
        {
          path: "/overview",
          element: <ProjectOverview />,
        },
        {
          path: "/register",
          element: <p />,
        },
        {
          path: "/login",
          element: <LoginPage />,
        },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
