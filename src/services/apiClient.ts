import { env } from "@/lib/env";
import { useAuthStore } from "@/store/authStore";
import type { ApiResponse } from "@/types/Api";

interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean;
}

export async function apiRequest<TData>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<TData>> {
  const { authenticated = true, headers, ...requestOptions } = options;
  const token = useAuthStore.getState().accessToken;
  const requestHeaders = new Headers(headers);

  requestHeaders.set("Content-Type", "application/json");

  if (authenticated && token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${env.VITE_API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: requestHeaders,
  });

  return response.json() as Promise<ApiResponse<TData>>;
}
