import { RoleEnum } from "../../utilities/enums/roleEnums";
import { StatusEnum } from "../../utilities/enums/statusEnums";
import { LoginModel } from "../../utilities/Interfaces/LoginInterface";
import {
  PaginationBase,
  ProjectData,
  ProjectStatusListData,
} from "../../utilities/Interfaces/ProjectInterface";
import {
  CreateUserData,
  UpdateUserModel,
  UserData,
  UserRoleData,
} from "../../utilities/Interfaces/UserInterfaces";
import http from "../http";

export class ApiClient {
  static baseUrl = "http://localhost:5219/api/";

  /* Login api */
  static async login(model: LoginModel) {
    try {
      const response = await http.post(
        ApiClient.baseUrl + "Login/LoginUser",
        model,
      );

      return response.data;
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  }

  /* User api */
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

      if (roleId) {
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
  static async getProjectPagination(
    searchValue: string,
    page: number,
    pageSize: number,
    sortOrder: string,
    status: StatusEnum,
  ) {
    try {
      const response = await http.get(
        ApiClient.baseUrl +
          `Project/GetProjects?searchValue=${searchValue}&page=${page}&pageSize=${pageSize}&sortOrder=${sortOrder}&statusFilter=${status}`,
      );

      const data: PaginationBase<ProjectData> = response.data;
      return data;
    } catch (error) {
      console.error("Error getting data: ", error);
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
}
