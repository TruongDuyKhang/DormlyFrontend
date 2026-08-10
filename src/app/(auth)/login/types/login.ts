export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  fullName: string;
  roles: string[]; // ["Admin"] | ["User"] | ["Manager"] | ["Staff"]
}