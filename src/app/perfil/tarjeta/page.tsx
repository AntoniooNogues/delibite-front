"use client";
import PerfilLayout from "@/components/PerfilLayout";
import FormularioPago from "@/components/FormularioPago";
import React, {useState} from "react";

export default function Tarjeta() {
    const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);
    const handleMostrarForm = () => {
        setMostrarFormularioPago(true);
    };
    return (
        <PerfilLayout>
            <button onClick={handleMostrarForm}>Mostrar</button>
            {mostrarFormularioPago && <FormularioPago setMostrarFormularioPago={setMostrarFormularioPago} totalConEnvio={20}  />}
        </PerfilLayout>
    );
}