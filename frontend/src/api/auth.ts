import api from "./client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  department_id: number | null;
  role: string;
  status: string;
  created_at: string;
}

export const login = async (data: LoginRequest) => {
  const response = await api.post("/api/auth/login", data);
  return response.data;
};

export const signup = async (data: SignupRequest) => {
  const response = await api.post("/api/auth/signup", data);
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get("/api/auth/me");
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("access_token");
};