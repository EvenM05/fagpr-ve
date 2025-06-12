import { LoginModel } from "../../utilities/Interfaces/LoginInterface";
import { UserData } from "../../utilities/Interfaces/UserInterfaces";
import http from "../http";

export class ApiClient {
  static baseUrl = "http://localhost:5219/api/";

  static async login(model: LoginModel) {
    try {
      const result = await http.post(
        ApiClient.baseUrl + "Login/LoginUser",
        model,
      );

      return result.data;
    } catch (error) {
      console.error("Error logging in: ", error);
    }
  }

  /* User api */
  static async getUserById(userId: string) {
    try {
      const result = await http.get(
        ApiClient.baseUrl + `User/GetUserById?id=${userId}`,
      );

      const data: UserData = result.data;
      return data;
    } catch (error) {
      console.error("Error getting data: ", error);
    }
  }
}
