'use client';
import React, { useEffect, useState } from 'react';
import axiosClient from '@/lib/axiosClient';
import PerfilLayout from '@/components/PerfilLayout';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Pedido {
    id: number;
    fecha: string;
    estado: string;
    codigo: string;
}

const FacturaPage: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await axiosClient.get('/pedido/listar');
                setPedidos(response.data);
            } catch {}
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
            <div className="min-h-screen flex flex-col items-center p-6">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center space-x-4 mb-8">
                        <ArrowLeft
                            onClick={() => window.history.back()}
                            className="cursor-pointer text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        />
                        <h2 className="text-2xl font-semibold text-gray-900">Facturas de tus pedidos</h2>
                    </div>

                    <ul className="space-y-6">
                        {pedidos.map((pedido) => (
                            <li key={pedido.id} className="p-6 bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col space-y-2">
                                            <p className="text-gray-700 text-base font-medium">Fecha: {format(new Date(pedido.fecha), 'dd/MM/yyyy')}</p>
                                            <p className="text-gray-700 text-base mt-1">Código: ***{pedido.codigo ? pedido.codigo.slice(-4) : 'N/A'}</p>
                                        </div>

                                        <div className="flex items-center">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${Number(pedido.estado) === 1 ? 'bg-yellow-100 text-yellow-800' :
                                        Number(pedido.estado) === 2 ? 'bg-blue-100 text-blue-800' :
                                            Number(pedido.estado) === 3 ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {Number(pedido.estado) === 1 ? 'En Proceso' :
                                            Number(pedido.estado) === 2 ? 'Enviado' :
                                                Number(pedido.estado) === 3 ? 'Entregado' :
                                                    'Desconocido'}
                                    </span>
                                        </div>
                                    </div>

                                    <div className="flex flew-row space-x-6 mt-4 max-sm:flex-col max-sm:space-y-4">
                                        <button
                                            onClick={() => handleDescargar(pedido.id)}
                                            className="py-2 px-6 bg-gradient-to-tr from-[var(--oxley-500)] to-[var(--oxley-700)] text-white rounded-full hover:from-[var(--primary-dark)] hover:to-[var(--oxley-900)] transition-all duration-300 transform hover:scale-105 active:scale-95 max-sm:w-full"
                                        >
                                            Descargar Factura
                                        </button>

                                        <button
                                            onClick={() => router.push(`/valoraciones?codigo=${pedido.codigo}`)}
                                            className="py-2 px-6 bg-gradient-to-r from-[var(--azul-visa)] to-(--azul-marino) text-white rounded-full hover:from-(--azul-oscuro) hover:to-(--azul-visa) transition-all duration-300 transform hover:scale-105 active:scale-95 max-sm:w-full"
                                        >
                                            Valorar Pedido
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </PerfilLayout>
    );
};

export default FacturaPage;
