import React from 'react';
import { useRouter } from 'next/navigation';
import '/src/app/administracion/administracion.css';
import { ErrorPropsInterface } from "@/interfaces/ErrorPropsInterface";

const ErrorPage: React.FC<ErrorPropsInterface> = ({ color, url, errorCode, title, message, textoBoton }) => {
    const router = useRouter();
    const fondo = color === 2 ? "#000" : "#EFEFEF";

    const handleClick = () => {
        if (url) {
            router.push(url);
        } else {
            router.push('/');
        }
    };

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center`} style={{ backgroundColor: fondo }}>
            <h1 className="text-[200px] textoPersonalizado text-center">{errorCode}</h1>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-6xl font-bold text-(--oxley-500) text-center">{title}</h1>
                <p className="text-2xl text-(--verde-azulado) mt-4 text-center">{message}</p>
                <button
                    onClick={handleClick}
                    className="mt-6 px-4 py-2 bg-(--primary-dark) text-white rounded-lg hover:scale-105 active:scale-95 shadow-2xl"
                >
                    {textoBoton}
                </button>
            </div>
        </div>
    );
};

export default ErrorPage;