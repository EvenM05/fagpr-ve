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

  if (userData?.roleId !== RoleEnum.Admin) {
    console.log("unautherized admin");
    return <Navigate to={"/Dashboard"} />;
  }

  return <>{children}</>;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = retrieveFromStorage("token");

  if (!token) {
    console.log("unautherized");
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
};
