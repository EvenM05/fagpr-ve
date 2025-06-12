import { LoginModel } from "../utilities/Interfaces/LoginInterface";
import http from "./http";

export class ApiClient {
  static baseUrl = "localhost:5089";

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
}
