export enum RoleEnum {
  User,
  ProjectManager,
  Admin,
}

export const getRoleName = (role: RoleEnum) => {
  switch (role) {
    case RoleEnum.Admin:
      return "Admin";
    case RoleEnum.ProjectManager:
      return "Project manager";
    case RoleEnum.User:
      return "User";
  }
};
