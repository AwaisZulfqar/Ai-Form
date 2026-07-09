import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  message: string;
  errors?: { field: string; message: string }[];
}

export class ApiRequestError extends Error {
  status?: number;
  errors?: { field: string; message: string }[];
  canceled: boolean;

  constructor(
    message: string,
    status?: number,
    errors?: { field: string; message: string }[],
    canceled = false
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
    this.canceled = canceled;
  }
}

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    // A request aborted via AbortController is not a real failure — flag it so
    // callers can ignore it instead of showing an error / rolling back.
    if (axios.isCancel(error)) {
      return Promise.reject(new ApiRequestError("Request canceled", undefined, undefined, true));
    }
    const message =
      error.response?.data?.message ?? "Network error — please check your connection.";
    const status = error.response?.status;
    const errors = error.response?.data?.errors;
    return Promise.reject(new ApiRequestError(message, status, errors));
  }
);

export const apiGet = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
  (await api.get<ApiSuccess<T>>(url, config)).data.data;

export const apiPost = async <T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => (await api.post<ApiSuccess<T>>(url, body, config)).data.data;

export const apiPatch = async <T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => (await api.patch<ApiSuccess<T>>(url, body, config)).data.data;

export default api;
