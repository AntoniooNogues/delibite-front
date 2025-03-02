'use client';
import React, { useEffect, useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import PerfilLayout from "@/components/PerfilLayout";

interface Pedido {
    id: number;
    fecha: string;
    estado: string;
    codigo: string;
}

const FacturaPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axiosClient.get('/pedido/listar');
                setPedidos(response.data);
            } catch {
                setError('Error al obtener pedidos');
            }
        };

        fetchPedidos();
    }, []);

    const handleDescargar = async (pedidoId: number) => {
        try {
            const response = await axiosClient.get('/pedido/descargar', {
                params: { pedido_id: pedidoId },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `pedido_${pedidoId}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error('Error al descargar pedido', error);
        }
    };

    return (
        <PerfilLayout>
            <div className="min-h-screen">
                <div className="flex flex-col justify-center items-center mt-6">
                    <div className="flex p-6 rounded-xl w-3/4 items-center">
                        <div className="flex-1 p-6">
                            <h1 className="text-2xl font-bold">Facturas</h1>
                            {error && <p className="text-red-500">{error}</p>}
                            <ul className="mt-4 space-y-4">
                                {pedidos.map(pedido => (
                                    <li key={pedido.id} className="bg-white p-4 rounded-xl shadow-md">
                                        <p>Fecha: {pedido.fecha}</p>
                                        <p>Estado: {pedido.estado}</p>
                                        <p>Código: {pedido.codigo}</p>
                                        <button
                                            onClick={() => handleDescargar(pedido.id)}
                                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg transition hover:bg-blue-600"
                                        >
                                            Descargar Factura
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </PerfilLayout>
    );
};

export default FacturaPage;