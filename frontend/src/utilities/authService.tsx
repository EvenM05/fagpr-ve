import { useState, useEffect } from "react";
import { RoleEnum } from "./enums/roleEnums";
import { UserData } from "./Interfaces/UserInterfaces";
import { ApiClient } from "../api/backendApi/BackendApi";
import { useNavigate } from "react-router-dom";

const useAuthService = () => {
  const [user, setUser] = useState<UserData>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async () => {
    const response = await ApiClient.getAuthenticatedUser();
    console.log("response status: ", response?.status);
    if (response?.status === 401 || !response) {
      navigate("/login");
    }
    setUser(response?.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
