import { RoleEnum } from "../enums/roleEnums";
import { StatusEnum } from "../enums/statusEnums";
import { ResourceData } from "./ResourceInterface";
import { UserData } from "./UserInterfaces";

export interface PaginationBase<T> {
  items: T[];
  totalItems: number;
}

export interface ProjectData {
  id: string;
  name: string;
  description: string;
  status: StatusEnum;
  createdDate: Date;
  updatedDate: Date;
  createdUser: UserData;
  updatedUser: UserData;
  resources: ResourceData[];
}

export interface ProjectStatusListData {
  totalProjects: number;
  toDoProjects: number;
  startedProjects: number;
  completedProjects: number;
  cancelledProjects: number;
}

export interface ProjectMonthlyDataModel {
  month: string;
  projectCount: number;
  projectBudget: number;
}
