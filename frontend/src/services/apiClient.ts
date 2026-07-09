import axios, { AxiosInstance, AxiosError } from "axios";

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

  constructor(message: string, status?: number, errors?: { field: string; message: string }[]) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
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
    const message =
      error.response?.data?.message ?? "Network error — please check your connection.";
    const status = error.response?.status;
    const errors = error.response?.data?.errors;
    return Promise.reject(new ApiRequestError(message, status, errors));
  }
);

export const apiGet = async <T>(url: string): Promise<T> =>
  (await api.get<ApiSuccess<T>>(url)).data.data;

export const apiPost = async <T>(url: string, body?: unknown): Promise<T> =>
  (await api.post<ApiSuccess<T>>(url, body)).data.data;

export const apiPatch = async <T>(url: string, body?: unknown): Promise<T> =>
  (await api.patch<ApiSuccess<T>>(url, body)).data.data;

export default api;
