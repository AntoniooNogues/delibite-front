"use client";
import PerfilLayout from "@/components/PerfilLayout";
import Alergenos from "@/components/Alergenos";
import React, { useState, useEffect } from "react";
import axiosClient from "@/lib/axiosClient";
import { ArrowLeft, X } from "lucide-react";
import Loading from "@/components/Loading";
import {Notificaciones} from "@/interfaces/Notificaciones";
import NotificacionComponent from "@/components/Notificacion";
import axios from "axios";

// Mapeo de IDs a nombres de alérgenos
const alergenosMap: Record<string, string> = {
    "1": "Altramuces",
    "2": "Apio",
    "3": "Cacahuetes",
    "4": "Crustáceos",
    "5": "Dióxido de sulfitos de azufre",
    "6": "Frutos de Cáscara",
    "7": "Gluten",
    "8": "Huevos",
    "9": "Lácteos",
    "10": "Moluscos",
    "11": "Mostaza",
    "12": "Pescado",
    "13": "Sésamo",
    "14": "Soja",
};

export default function Personalizar() {
    const [selectedAlergenos, setSelectedAlergenos] = useState<string[]>([]);
    const [initialAlergenos, setInitialAlergenos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notificacion, setNotificacion] = useState<Notificaciones>();


    useEffect(() => {
        axiosClient.get("/alergenos/getByUser")
            .then(response => {
                const alergenos = response.data.map((alergeno: { id: number }) => `${alergeno.id}.svg`);
                setSelectedAlergenos(alergenos);
                setInitialAlergenos(alergenos);
            })
            .catch(error => {
                console.error("Error al obtener los alérgenos:", error);
            })
            .finally(() => {
            setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loading /></div>;
    }
    const handleSubmit = async () => {
        if (JSON.stringify(selectedAlergenos) !== JSON.stringify(initialAlergenos)) {
            try {
                const response = await axiosClient.put("/alergenos/editar", { alergenos: selectedAlergenos });
                if (response) {
                    setNotificacion({
                        titulo: "Alergenos modificados con éxito.",
                        mensaje: "Se ha modificado con éxito",
                        code: 201,
                        tipo: "access"
                    });
                }
            } catch (error: unknown) {
                if (axios.isAxiosError(error) && error.response) {
                    setNotificacion({
                        titulo: error.response.data.titulo,
                        mensaje: error.response.data.mensaje,
                        code: error.response.data.code,
                        tipo: error.response.data.tipo
                    });
                }
            }
        }
    };

    const removeAlergeno = (alergeno: string) => {
        setSelectedAlergenos(selectedAlergenos.filter(item => item !== alergeno));
    };

    return (
        <PerfilLayout>
            <div className="bg-white px-6 py-4 rounded-2xl">
                <div className="flex items-center space-x-6 mb-4">
                    <ArrowLeft onClick={() => window.history.back()} className="cursor-pointer"/>
                    <h2 className="text-2xl font-bold">Alergenos a excluir</h2>
                </div>

                <div className="mt-6">
                    {/* Componente de selección de alérgenos */}
                    <Alergenos
                        selectedAlergenos={selectedAlergenos}
                        setSelectedAlergenos={setSelectedAlergenos}
                    />

                    {/* Lista de alérgenos seleccionados */}
                    {selectedAlergenos.length > 0 && (
                        <div className="mt-6">
                            <h3 className="text-xl font-semibold mb-2">Seleccionados:</h3>
                            <div className="flex flex-wrap gap-2">
                                {selectedAlergenos.map((alergeno, index) => {
                                    const alergenoId = alergeno.replace(".svg", "");
                                    const alergenoNombre = alergenosMap[alergenoId] || "Desconocido";

                                    return (
                                        <div key={index} className="flex items-center bg-(--oxley-200) px-3 py-1
                                        rounded-full text-md hover:bg-(--oxley-300) hover:scale-105 active:scale-95 active:bg-(--oxley-500)">
                                            <span>{alergenoNombre}</span>
                                            <X className="ml-2 w-4 h-4 cursor-pointer" onClick={() => removeAlergeno(alergeno)} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        className="mt-6 w-full sm:w-auto px-4 py-2 rounded-lg text-white bg-(--verde-azulado) hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:text-white transition transform active:scale-95 hover:scale-105"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(undefined)}
                />
            )}
        </PerfilLayout>
    );
}
