export interface LoginModel {
  email: string;
  password: string;
}

export interface LoginResponseModel {
  token: string;
  userId: string;
}

export interface RegisterModel {
  name: string;
  email: string;
  password: string;
}
