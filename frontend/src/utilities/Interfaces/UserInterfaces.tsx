import { RoleEnum } from "../enums/roleEnums";

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: RoleEnum;
}
