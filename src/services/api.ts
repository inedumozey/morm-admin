import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`,
  },
});

export { api };
