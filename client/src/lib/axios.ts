import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://localhost:3001",
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log(config.transitional)
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
