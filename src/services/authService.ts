import { apiRequest } from "@/services/apiClient";
import type { CurrentUser } from "@/types/User";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: CurrentUser;
}

export function login(payload: LoginPayload) {
  return apiRequest<LoginResponse>("/auth/login", {
    authenticated: false,
    body: JSON.stringify(payload),
    method: "POST",
  });
}

export function logout() {
  return apiRequest<null>("/auth/logout", {
    method: "POST",
  });
}
