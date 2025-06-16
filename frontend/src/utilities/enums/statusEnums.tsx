export enum StatusEnum {
  ToDo,
  InProgress,
  Completed,
  Cancelled,
}

export const getStatusColor = (
  status: StatusEnum,
):
  | "default"
  | "primary"
  | "secondary"
  | "error"
  | "info"
  | "success"
  | "warning" => {
  switch (status) {
    case StatusEnum.ToDo:
      return "default";
    case StatusEnum.InProgress:
      return "info";
    case StatusEnum.Completed:
      return "success";
    case StatusEnum.Cancelled:
      return "error";
    default:
      return "default";
  }
};

export const getStatusName = (status: StatusEnum): string => {
  switch (status) {
    case StatusEnum.ToDo:
      return "To Do";
    case StatusEnum.InProgress:
      return "In Progress";
    case StatusEnum.Completed:
      return "Completed";
    case StatusEnum.Cancelled:
      return "Cancelled";
    default:
      return "Unknown";
  }
};
