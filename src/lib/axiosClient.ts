import axios, {AxiosError, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create({
    baseURL: "/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor de peticiones
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get("token");
        if (token) {
            if (!config.headers) {
                config.headers = {} as AxiosRequestHeaders;
            }
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);


export default axiosClient;