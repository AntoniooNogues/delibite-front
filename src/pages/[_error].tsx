import React from 'react';
import { useRouter } from 'next/navigation';
import '/src/app/administracion/administracion.css';
import { ErrorPropsInterface } from "@/interfaces/ErrorPropsInterface";

const ErrorPage: React.FC<ErrorPropsInterface> = ({ errorCode, title, message, url, color }) => {
    const router = useRouter();
    let fondo: string = "";
    if (color > 3 ||color < 1 || color === 1) {
        fondo = "#EFEFEF";
    }
    if (color === 2) {
        fondo = "#000";
    }

    return (
        <div className={`min-h-screen bg-[${fondo}] flex flex-col items-center justify-center`}>
            <h1 className="text-[200px] textoPersonalizado text-center">{errorCode}</h1>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bold text-(--oxley-500) text-center">{title}</h1>
                <p className="text-2xl text-(--verde-azulado) mt-4 text-center">{message}</p>
                <button
                    onClick={() => router.push(url)}
                    className="mt-6 px-4 py-2 bg-(--primary-dark) text-white rounded-lg hover:scale-105 active:scale-95 shadow-2xl"
                >
                    Volver al inicio de sesión
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;