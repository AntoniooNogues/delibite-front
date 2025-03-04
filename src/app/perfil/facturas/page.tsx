'use client';
import React, { useEffect, useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import PerfilLayout from "@/components/PerfilLayout";
import { format } from 'date-fns';
import {ArrowLeft} from "lucide-react";

interface Pedido {
    id: number;
    fecha: string;
    estado: string;
    codigo: string;
}

const FacturaPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axiosClient.get('/pedido/listar');
                setPedidos(response.data);
            } catch {
            }
        };

        fetchPedidos();
    }, [pedidos]);

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
                <div className="flex flex-col justify-center items-center">
                    <div className="flex p-6 rounded-xl w-3/4 items-center">
                        <div className="flex-1">
                            <div className="flex items-center space-x-6 mb-4">
                                <ArrowLeft onClick={() => window.history.back()} className="cursor-pointer"/>
                                <h2 className="text-2xl font-bold">Facturas de tus pedidos</h2>
                            </div>
                            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {pedidos.map(pedido => (
                                    <li key={pedido.id} className="bg-white p-4 rounded-xl shadow-md">
                                        <p>Fecha: {format(new Date(pedido.fecha), 'dd/MM/yyyy')}</p>
                                        <p>Estado: {Number(pedido.estado) === 1 ? 'En Proceso' : Number(pedido.estado) === 2 ? 'Enviado' : Number(pedido.estado) === 3 ? 'Entregado' : 'Desconocido'}</p>
                                        <p>Código: ***{pedido.codigo ? pedido.codigo.slice(-4) : 'N/A'}</p>
                                        <button
                                            onClick={() => handleDescargar(pedido.id)}
                                            className="mt-4 px-4 py-2 rounded-full text-white bg-(--oxley-500)
hover:bg-(--oxley-700) active:bg-(--oxley-800) hover:text-white transition transform
active:scale-95 hover:scale-105"
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