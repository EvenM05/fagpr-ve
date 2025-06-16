import { StatusEnum } from "../enums/statusEnums";
import { CustomerData } from "./CustomerInterface";
import { ResourceData } from "./ResourceInterface";
import { UserData } from "./UserInterfaces";

export interface CreateProjectModel {
  name: string;
  description: string;
  createdUserId: string;
}

export interface UpdateProjectModel {
  name: string;
  description: string;
  status: StatusEnum;
  updatedUserId: string;
}

export interface UpdateProjectCustomerModel {
  customerId: string;
  updatedUserId: string;
}

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
  customer: CustomerData;
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
