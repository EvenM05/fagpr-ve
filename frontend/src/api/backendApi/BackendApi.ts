import { AxiosResponse } from "axios";
import { RoleEnum } from "../../utilities/enums/roleEnums";
import { StatusEnum } from "../../utilities/enums/statusEnums";
import {
  CreateCustomerData,
  CustomerData,
} from "../../utilities/Interfaces/CustomerInterface";
import {
  LoginModel,
  LoginResponseModel,
} from "../../utilities/Interfaces/LoginInterface";
import {
  CreateProjectModel,
  PaginationBase,
  ProjectData,
  ProjectMonthlyDataModel,
  ProjectStatusListData,
  UpdateProjectCustomerModel,
  UpdateProjectModel,
} from "../../utilities/Interfaces/ProjectInterface";
import { CreateResourceData } from "../../utilities/Interfaces/ResourceInterface";
import {
  CreateUserData,
  UpdateUserModel,
  UserData,
  UserRoleData,
} from "../../utilities/Interfaces/UserInterfaces";
import http from "../http";
import { useNavigate } from "react-router-dom";

export class ApiClient {
  static baseUrl = "http://localhost:5219/api/";

  /* Login api */
  static async login(model: LoginModel) {
    try {
      const response = await http.post(
        ApiClient.baseUrl + "Login/LoginUser",
        model,
      );

      const loginResponse: AxiosResponse<LoginResponseModel> = response;
      return loginResponse;
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  }

  /* User api */
  static async getAuthenticatedUser() {
    try {
      const response = await http.get(
        ApiClient.baseUrl + "User/GetAuthenticatedUser",
      );

      const data: AxiosResponse<UserData> = response;

      return data;
    } catch (error) {
      console.error("Error getting authenticatedUser: ", error);
    }
  }

  static async postUser(model: CreateUserData) {
    try {
      const response = await http.post(
        ApiClient.baseUrl + "User/CreateUser",
        model,
      );

      return response.data;
    } catch (error) {
      console.error("Error posting data: ", error);
    }
  }

  static async updateUserData(userId: string, model: UpdateUserModel) {
    try {
      const response = await http.put(
        ApiClient.baseUrl + `User/UpdateUserData?userId=${userId}`,
        model,
      );

      return response.data;
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  }

  static async getUserPagination(
    searchValue: string,
    page: number,
    pageSize: number,
    roleId?: RoleEnum,
  ) {
    try {
      const params = new URLSearchParams({
        searchValue,
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (roleId !== undefined) {
        params.append("roleFilter", roleId.toString());
      }

      const url = `${
        ApiClient.baseUrl
      }User/GetUserPagination?${params.toString()}`;

      const response = await http.get(url);

      const data: PaginationBase<UserData> = response.data;
      return data;
    } catch (error) {
      console.error("Error getting data: ", error);
    }
  }

  static async getAllUsers() {
    try {
      const response = await http.get(ApiClient.baseUrl + "User/GetAllUsers");

      const data: UserData[] = response.data;
      return data;
    } catch (error) {
      console.error("Error getting data: ", error);
    }
  }

  static async getUserById(userId: string) {
    try {
      const response = await http.get(
        ApiClient.baseUrl + `User/GetUserById?id=${userId}`,
      );

      const data: UserData = response.data;
      return data;
    } catch (error) {
      console.error("Error getting data: ", error);
    }
  }

  static async getUserRoleData() {
    try {
      const response = await http.get(
        ApiClient.baseUrl + "User/GetUserRoleData",
      );
      const data: UserRoleData = response.data;
      return data;
    } catch (error) {
      console.error("Error getting user role data: ", error);
    }
  }

  static async deleteuser(userId: string) {
    try {
      const response = await http.delete(
        ApiClient.baseUrl + `User/DeleteUser?userId=${userId}`,
      );

      return response.data;
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  }

  /* Project api */
  static async postProject(model: CreateProjectModel) {
    try {
      const response = await http.post(
        ApiClient.baseUrl + "Project/CreateProject",
        model,
      );

      return response.data;
    } catch (error) {
      console.error("Error creating project: ", error);
    }
  }

  static async updateProject(projectId: string, model: UpdateProjectModel) {
    try {
      const response = await http.put(
        ApiClient.baseUrl + `Project/UpdateProject?id=${projectId}`,
        model,
      );

      return response.data;
    } catch (error) {
      console.error("Error updating project data: ", error);
    }
  }

  static async updateProjectCustomer(
    projectId: string,
    model: UpdateProjectCustomerModel,
  ) {
    try {
      const response = await http.put(
        ApiClient.baseUrl + `Project/UpdateProjectCustomer?id=${projectId}`,
        model,
      );
      return response.data;
    } catch (error) {
      console.error("Error updating project customer: ", error);
    }
  }

  static async GetProjectById(id: string) {
    try {
      const response = await http.get(
        ApiClient.baseUrl + `Project/GetProjectById?id=${id}`,
      );

      const data: ProjectData = response.data;
      return data;
    } catch (error) {
      console.error("Error getting project data: ", error);
    }
  }

  static async getProjectPagination(
    searchValue: string,
    page: number,
    pageSize: number,
    sortOrder: string,
    status: StatusEnum | undefined,
  ) {
    try {
      const params = new URLSearchParams({
        searchValue,
        page: page.toString(),
        pageSize: pageSize.toString(),
        sortOrder,
      });

      if (status !== undefined) {
        params.append("statusFilter", status.toString());
      }

      const response = await http.get(
        `${ApiClient.baseUrl}Project/GetProjects?${params.toString()}`,
      );

      const data: PaginationBase<ProjectData> = response.data;
      return data;
    } catch (error) {
      console.error("Error getting project data: ", error);
    }
  }

  static async getProjectStatusList() {
    try {
      const response = await http.get(
        ApiClient.baseUrl + "Project/GetProjectStatusList",
      );

      const data: ProjectStatusListData = response.data;
      return data;
    } catch (error) {
      console.error("Error getting data: ", error);
    }
  }

  static async getProjectMonthlyData() {
    try {
      const response = await http.get(
        ApiClient.baseUrl + "Project/GetProjectMonthlyData",
      );

      const data: ProjectMonthlyDataModel[] = response.data;
      return data;
    } catch (error) {
      console.error("Error getting data: ", error);
    }
  }

  /* Customer api */
  static async postCustomer(model: CreateCustomerData) {
    try {
      const response = await http.post(
        ApiClient.baseUrl + "Customer/CreateCustomer",
        model,
      );
      return response.data;
    } catch (error) {
      console.error("Error creating customer: ", error);
    }
  }

  static async getCustomerPagination(
    searchValue: string,
    page: number,
    pageSize: number,
  ) {
    try {
      const response = await http.get(
        ApiClient.baseUrl +
          `Customer/GetCustomerPagination?searchValue=${searchValue}&page=${page}&pageSize=${pageSize}`,
      );

      const data: PaginationBase<CustomerData> = response.data;
      return data;
    } catch (error) {
      console.error("Error getting customer: ", error);
    }
  }

  static async getAllCustomer() {
    try {
      const response = await http.get(
        ApiClient.baseUrl + "Customer/GetAllCustomers",
      );

      const data: CustomerData[] = response.data;
      return data;
    } catch (error) {
      console.error("Error getting customer: ", error);
    }
  }

  /* Resource api */
  static async postResource(model: CreateResourceData) {
    try {
      const response = await http.post(
        ApiClient.baseUrl + "Resource/CreateResource",
        model,
      );

      return response;
    } catch (error) {
      console.error("Error creating resource: ", error);
    }
  }
}
