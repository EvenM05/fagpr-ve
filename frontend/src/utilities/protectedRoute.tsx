import { Navigate } from "react-router-dom";
import { retrieveFromStorage } from "./localStorage";
import { useGetUserById } from "../api/hooks";
import { RoleEnum } from "./enums/roleEnums";

export const ProtectedRoute = () => {
  const token = retrieveFromStorage("token");
  const userId = retrieveFromStorage("userId");

  const { data: userData } = useGetUserById(userId || "");

  if (userData?.role === RoleEnum.Admin || RoleEnum.ProjectManager) {
    if (!token) {
      return <Navigate to={"/login"} />;
    }
  }
};
