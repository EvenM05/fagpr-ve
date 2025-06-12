import axios from "axios";
import {
  retrieveFromCookie,
  retrieveFromStorage,
} from "../utilities/localStorage";

const axiosInstance = axios.create({
  baseURL: "api/",
  headers: {
    Accept: "application/json",
    Authorization: "*",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = retrieveFromStorage("token") || retrieveFromCookie("token");
  if (config && config.url && !!token && !config.url.includes("Login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (error) => {
    const isOnline = navigator.onLine;
    if (!isOnline) {
      return Promise.resolve();
    }

    if (!error.response) {
      console.error(`Axios error: ${error}`);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
