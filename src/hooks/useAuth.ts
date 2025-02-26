import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
import { ErrorPropsInterface } from '@/interfaces/ErrorPropsInterface';

export const useAuth = () => {
    const [token, setDecodedToken] = useState<{ roles: string[], username: string } | null>(null);
    const [error, setError] = useState<ErrorPropsInterface | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const tokenUsuario = Cookies.get('token');
            if (tokenUsuario) {
                try {
                    const tokenDescodificado = jwtDecode<{ roles: string[], username: string }>(tokenUsuario);
                    console.log("Decoded roles:", tokenDescodificado.roles);
                    if (!tokenDescodificado.roles.includes('ROLE_ADMINISTRADOR') && !tokenDescodificado.roles.includes('ROLE_SUPERVISOR')) {
                        setError({
                            errorCode: "403",
                            title: "Acceso denegado",
                            message: "No tienes permisos para acceder a esta página.",
                            url: "/administracion/login",
                            color: 2
                        })
                    }
                    setDecodedToken(tokenDescodificado);
                } catch (error) {
                    console.error("Error decoding token or access denied:", error);
                    setError({
                        errorCode: "401",
                        title: "Acceso denegado",
                        message: "No tienes permisos para acceder a esta página.",
                        url: "/administracion/login",
                        color: 2
                    });
                }
            }else{
                setError({
                    errorCode: "401",
                    title: "Acceso denegado",
                    message: "No tienes permisos para acceder a esta página.",
                    url: "/administracion/login",
                    color: 2
                });
            }
        }
    }, [router]);

    return { token, error };
};