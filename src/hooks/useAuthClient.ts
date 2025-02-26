import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { ErrorPropsInterface } from "@/interfaces/ErrorPropsInterface";

interface DecodedToken {
    roles: string[];
    username: string;
}

export const useAuth = () => {
    const [token, setDecodedToken] = useState<DecodedToken | null>(null);
    const [error, setError] = useState<ErrorPropsInterface | null>(null);
    const router = useRouter();

    useEffect(() => {
        const tokenUsuario = Cookies.get("token");

        if (!tokenUsuario) {
            setError({
                errorCode: "401",
                title: "Acceso denegado",
                message: "Debes iniciar sesión para acceder.",
                url: "/login",
                color: 1,
            });
            router.push("/login");
            return;
        }

        try {
            const tokenDescodificado = jwtDecode<DecodedToken>(tokenUsuario);
            setDecodedToken(tokenDescodificado);

            if (!tokenDescodificado.roles.includes("ROLE_USUARIO")) {
                setError({
                    errorCode: "403",
                    title: "Acceso denegado",
                    message: "No tienes permisos para acceder a esta página.",
                    url: "/login",
                    color: 1,
                });
                router.push("/login");
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            setError({
                errorCode: "401",
                title: "Acceso denegado",
                message: "Debes iniciar sesión para acceder.",
                url: "/login",
                color: 1,
            });
            router.push("/login");
        }
    }, [router]);

    return { token, error };
};
