import { EstimateEnum } from "../enums/estimateEnums";

export interface ResourceData {
  id: string;
  estimateType: EstimateEnum;
  timeHours: number;
  timeCost: number;
  totalCost: number;
  projectId: string;
}
