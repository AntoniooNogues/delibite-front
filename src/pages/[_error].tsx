import React from 'react';
import { useRouter } from 'next/navigation';
import '/src/app/administracion/administracion.css';
import {ErrorPropsInterface} from "@/pages/ErrorPropsInterface";


const ErrorPage: React.FC<ErrorPropsInterface> = ({ errorCode, title, message, url }) => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-(--oxley-950) flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
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
        </div>
    );
};

export default ErrorPage;