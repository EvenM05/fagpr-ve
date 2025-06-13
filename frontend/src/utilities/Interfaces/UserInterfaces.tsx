import { RoleEnum } from "../enums/roleEnums";

export interface UserData {
  id: string;
  name: string;
  email: string;
  roleId: RoleEnum;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  roleId: RoleEnum;
}

export interface UpdateUserModel {
  name?: string;
  password?: string;
  roleId?: RoleEnum;
}
