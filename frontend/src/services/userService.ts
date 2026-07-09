import { apiGet } from "./apiClient";
import type { Author } from "../types";

export const getUsers = () => apiGet<Author[]>("/users");
