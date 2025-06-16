import { useMutation, useQuery } from "@tanstack/react-query";
import {
  LoginModel,
  LoginResponseModel,
} from "../../utilities/Interfaces/LoginInterface";
import { ApiClient } from "../backendApi/BackendApi";
import {
  GET_ALL_USERS,
  GET_CUSTOMER_PAGINATION,
  GET_PROJECT_MONTHLY_DATA,
  GET_PROJECT_PAGINATION,
  GET_PROJECT_STATUS_LIST,
  GET_USER_BY_ID,
  GET_USER_PAGINATION,
  GET_USER_ROLE_DATA,
} from "../constants";
import { StatusEnum } from "../../utilities/enums/statusEnums";
import {
  CreateUserData,
  UpdateUserModel,
  UserData,
} from "../../utilities/Interfaces/UserInterfaces";
import { RoleEnum } from "../../utilities/enums/roleEnums";
import { CreateCustomerData } from "../../utilities/Interfaces/CustomerInterface";

/* login hooks */
export const useLogin = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (model: LoginModel): Promise<LoginResponseModel> =>
      ApiClient.login(model),
    onSuccess,
  });

/* User hooks */
export const usePostUser = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (data: CreateUserData): Promise<UserData> =>
      ApiClient.postUser(data),
    onSuccess,
  });

export const useUpdateUser = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (data: {
      userId: string;
      model: UpdateUserModel;
    }): Promise<UserData> => ApiClient.updateUserData(data.userId, data.model),
    onSuccess,
  });

export const useGetUserPagination = (
  searchValue: string,
  page: number,
  pageSize: number,
  roleId: RoleEnum | undefined,
) =>
  useQuery({
    queryKey: [GET_USER_PAGINATION, searchValue, page, pageSize, roleId],
    queryFn: () =>
      ApiClient.getUserPagination(searchValue, page, pageSize, roleId),
  });

export const useGetAllUsers = () =>
  useQuery({
    queryKey: [GET_ALL_USERS],
    queryFn: () => ApiClient.getAllUsers(),
  });

export const useGetUserById = (id: string) =>
  useQuery({
    queryKey: [GET_USER_BY_ID, id],
    queryFn: () => ApiClient.getUserById(id),
  });

export const useGetUserRoleData = () =>
  useQuery({
    queryKey: [GET_USER_ROLE_DATA],
    queryFn: () => ApiClient.getUserRoleData(),
  });

export const useDeleteUser = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (id: string): Promise<UserData> => ApiClient.deleteuser(id),
    onSuccess,
  });

/* Project hooks */
export const useGetProjectPagination = (
  searchValue: string,
  page: number,
  pageSize: number,
  sortOrder: string,
  status: StatusEnum,
) =>
  useQuery({
    queryKey: [
      GET_PROJECT_PAGINATION,
      searchValue,
      page,
      pageSize,
      sortOrder,
      status,
    ],
    queryFn: () =>
      ApiClient.getProjectPagination(
        searchValue,
        page,
        pageSize,
        sortOrder,
        status,
      ),
  });

export const useGetProjectStatusList = () =>
  useQuery({
    queryKey: [GET_PROJECT_STATUS_LIST],
    queryFn: () => ApiClient.getProjectStatusList(),
  });

export const useGetProjectMonthlyData = () =>
  useQuery({
    queryKey: [GET_PROJECT_MONTHLY_DATA],
    queryFn: () => ApiClient.getProjectMonthlyData(),
  });

/* Customer hooks */
export const usePostCustomer = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (model: CreateCustomerData) => ApiClient.postCustomer(model),
    onSuccess,
  });

export const useGetCustomerPagination = (
  searchValue: string,
  page: number,
  pageSize: number,
) =>
  useQuery({
    queryKey: [GET_CUSTOMER_PAGINATION, searchValue, page, pageSize],
    queryFn: () => ApiClient.getCustomerPagination(searchValue, page, pageSize),
  });
