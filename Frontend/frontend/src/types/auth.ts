export interface AuthResponse {
  accessToken: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar:string,
    isVerified:boolean,
  };
}