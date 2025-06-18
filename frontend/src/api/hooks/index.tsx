import { useMutation, useQuery } from "@tanstack/react-query";
import {
  LoginModel,
  LoginResponseModel,
} from "../../utilities/Interfaces/LoginInterface";
import { ApiClient } from "../backendApi/BackendApi";
import {
  GET_ALL_CUSTOMERS,
  GET_ALL_USERS,
  GET_CUSTOMER_PAGINATION,
  GET_PROJECT_BY_ID,
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
import {
  CreateCustomerData,
  UpdateCustomerData,
} from "../../utilities/Interfaces/CustomerInterface";
import { CreateResourceData } from "../../utilities/Interfaces/ResourceInterface";
import {
  CreateProjectModel,
  UpdateProjectCustomerModel,
  UpdateProjectModel,
} from "../../utilities/Interfaces/ProjectInterface";
import { AxiosResponse } from "axios";

/* login hooks */
export const useLogin = () =>
  useMutation({
    mutationFn: (
      model: LoginModel,
    ): Promise<AxiosResponse<LoginResponseModel, undefined> | undefined> =>
      ApiClient.login(model),
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
export const usePostProject = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (model: CreateProjectModel) => ApiClient.postProject(model),
    onSuccess,
  });

export const useUpdateProject = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (data: { projectId: string; model: UpdateProjectModel }) =>
      ApiClient.updateProject(data.projectId, data.model),
    onSuccess,
  });

export const useChangeProjectCustomer = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (data: {
      projectId: string;
      model: UpdateProjectCustomerModel;
    }) => ApiClient.updateProjectCustomer(data.projectId, data.model),
    onSuccess,
  });

export const useGetProjectById = (id: string) =>
  useQuery({
    queryKey: [GET_PROJECT_BY_ID, id],
    queryFn: () => ApiClient.GetProjectById(id),
  });

export const useGetProjectPagination = (
  searchValue: string,
  page: number,
  pageSize: number,
  sortOrder: string,
  status: StatusEnum | undefined,
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

export const useUpdateCustomer = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (model: UpdateCustomerData) =>
      ApiClient.updateCustomer(model.customerId, model.updateData),
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

export const useGetAllCustomers = () =>
  useQuery({
    queryKey: [GET_ALL_CUSTOMERS],
    queryFn: () => ApiClient.getAllCustomer(),
  });

export const useDeleteCustomer = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (customerId: string) => ApiClient.deleteCustomer(customerId),
    onSuccess,
  });

/* Resource hooks */
export const usePostResource = (onSuccess: () => void) =>
  useMutation({
    mutationFn: (data: CreateResourceData) => ApiClient.postResource(data),
    onSuccess,
  });
