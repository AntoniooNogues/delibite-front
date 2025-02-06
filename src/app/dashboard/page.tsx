"use client";
import axiosClient from "../../lib/axiosClient";
import { useEffect, useState } from "react";
interface Alergeno {
    id: number;
    nombre: string;
}
export default function Dashboard() {
    const [alergenos, setAlergenos] = useState<Alergeno[]>([]);

    useEffect(() => {
        axiosClient.get("/alergenos/all")
            .then((response) => setAlergenos(response.data))
            .catch((error) => console.error("Error obteniendo alergenos", error));
    }, []);
    return (
        <div>
            <h1 className={"text-fuchsia-700 font-extrabold text-6xl"}>work</h1>
            <ul>
                {alergenos.map((alergeno) => (
                    <li key={alergeno.id}>{alergeno.nombre}</li>
                ))}
            </ul>
        </div>

    );
}