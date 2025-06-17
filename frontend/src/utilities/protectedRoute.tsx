import { Navigate } from "react-router-dom";
import { RoleEnum } from "./enums/roleEnums";
import React from "react";
import useAuthService from "./authService";

interface ProtectedRouteProps {
  roles: RoleEnum[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
}) => {
  const { isAdmin, isPM, loading } = useAuthService();

  const isAuthenticated = () => {
    for (const role of roles) {
      switch (role) {
        case RoleEnum.Admin:
          if (isAdmin()) return true;
          break;
        case RoleEnum.ProjectManager:
          if (isPM()) return true;
          break;
        default:
          return false;
      }
    }
  };

  if (!loading) {
    if (!isAuthenticated()) {
      console.log("unautherized");
      return <Navigate to={"/login"} />;
    }
  }

  return <>{children}</>;
};
