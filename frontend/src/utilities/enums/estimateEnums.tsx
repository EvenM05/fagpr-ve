export enum EstimateEnum {
  UX,
  IsDevelopment,
  ProjectManagment,
  Testing,
}

export const getEstimateName = (role: EstimateEnum) => {
  switch (role) {
    case EstimateEnum.UX:
      return "UX/UI";
    case EstimateEnum.IsDevelopment:
      return "Development";
    case EstimateEnum.ProjectManagment:
      return "Project Management";
    case EstimateEnum.Testing:
      return "Testing";
  }
};
