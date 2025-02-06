import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";

const axiosClient = axios.create({
    baseURL: "/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor de peticiones
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("token");
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
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.log("Sesión expirada, redirigiendo...");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosClient;