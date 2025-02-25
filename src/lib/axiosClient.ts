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

// Interceptor de respuestas
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            Cookies.remove("token");
            window.dispatchEvent(new CustomEvent("tokenExpirado", { detail: { titulo: "Sesión expirada", mensaje: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", code: 401, tipo: "error" } }));
        }
        return Promise.reject(error);
    }
);

export default axiosClient;