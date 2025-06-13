import { Navigate } from "react-router-dom";
import { retrieveFromStorage } from "./localStorage";
import { useGetUserById } from "../api/hooks";
import { RoleEnum } from "./enums/roleEnums";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userId = retrieveFromStorage("userId");

  const { data: userData } = useGetUserById(userId || "");
  console.log(userData?.roleId);

  if (userData?.roleId !== RoleEnum.Admin) {
    return <Navigate to={"/Dashboard"} />;
  }

  return <>{children}</>;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = retrieveFromStorage("token");

  if (!token) {
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
};
