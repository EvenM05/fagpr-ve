import { useState, useEffect } from "react";
import { RoleEnum } from "./enums/roleEnums";
import { UserData } from "./Interfaces/UserInterfaces";
import { ApiClient } from "../api/backendApi/BackendApi";

const useAuthService = () => {
  const [user, setUser] = useState<UserData>();
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const user = await ApiClient.getAuthenticatedUser();
    setUser(user);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  console.log("user role", user?.roleId);

  const isAdmin = () => {
    if (user && user.roleId === RoleEnum.Admin) return true;
    else return false;
  };

  const isPM = () => {
    if (user && user.roleId === RoleEnum.ProjectManager) return true;
    else return false;
  };

  return { user, isAdmin, isPM, loading };
};

export default useAuthService;
