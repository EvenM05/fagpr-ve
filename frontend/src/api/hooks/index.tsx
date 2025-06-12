import { useMutation, useQuery } from "@tanstack/react-query";
import {
  LoginModel,
  LoginResponseModel,
} from "../../utilities/Interfaces/LoginInterface";
import { ApiClient } from "../backendApi/BackendApi";
import { GET_USER_BY_ID } from "../constants";

export const useLogin = () =>
  useMutation({
    mutationFn: (model: LoginModel): Promise<LoginResponseModel> =>
      ApiClient.login(model),
  });

/* User hooks */
export const useGetUserById = (id: string) =>
  useQuery({
    queryKey: [GET_USER_BY_ID, id],
    queryFn: () => ApiClient.getUserById(id),
  });
