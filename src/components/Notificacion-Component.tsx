// src/components/NotificacionComponent.tsx
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Notificaciones } from '@/interfaces/Notificaciones';

interface NotificacionProps {
    Notificaciones: Notificaciones;
    onClose: () => void;
}

export default function NotificacionComponent({ Notificaciones, onClose }: NotificacionProps) {
    const [visible, setVisible] = useState(true);
    const icon = Notificaciones.tipo === 'error' ? <ExclamationCircleIcon className="h-6 w-6 text-red-500" /> : <CheckCircleIcon className="h-6 w-6 text-green-500" />;

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!visible) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg flex items-center space-x-4 z-10"
        >
            {icon}
            <div>
                <strong>{Notificaciones.titulo}</strong> <span className="text-sm text-gray-500">({Notificaciones.code})</span>
                <div>{Notificaciones.mensaje}</div>
            </div>
            <button onClick={() => { setVisible(false); onClose(); }} className="flex items-center hover:scale-105 active:scale-95 transition-transform">
                <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
        </motion.div>
    );
}