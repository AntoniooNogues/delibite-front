import React, {useState} from 'react';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { MinusCircleIcon } from "@heroicons/react/20/solid";



interface CantidadControlProps {
    cantidadInicial: number;
    handleCantidadChange: (value: number) => void;
    width: number;
    height: number;
}

const CantidadControl: React.FC<CantidadControlProps> = ({cantidadInicial, handleCantidadChange, width, height }) => {
    const [cantidad, setCantidad] = useState(cantidadInicial);

    const incrementar = () => {
        const nuevaCantidad = cantidad + 1;
        setCantidad(nuevaCantidad);
        handleCantidadChange(nuevaCantidad);
    };

    const decrementar = () => {
        const nuevaCantidad = cantidad - 1;
        if (nuevaCantidad >= 0) {
            setCantidad(nuevaCantidad);
            handleCantidadChange(nuevaCantidad);
        }
    };

    return (
        <>
            {cantidad ? (
                <div className="flex items-center justify-between bg-(--oxley-400) rounded-full ">
                    <button
                        className="bg-(--oxley-500) text-(--oxley-50) rounded-full transition transform hover:bg-(--primary-dark) hover:scale-105 active:bg-(--oxley-700) active:scale-95"
                        onClick={decrementar}
                    >
                        <MinusCircleIcon style={{ width, height }} />
                    </button>
                    <span className="mx-4 font-extrabold rounded-full bg-white flex items-center justify-center" style={{ width, height }}>
                        {cantidad}
                    </span>
                    <button
                        className="bg-(--oxley-500) text-(--oxley-50) rounded-full transition transform hover:bg-(--primary-dark) hover:scale-105 active:bg-(--oxley-700) active:scale-95"
                        onClick={incrementar}
                    >
                        <PlusCircleIcon style={{ width, height }} />
                    </button>
                </div>
            ) : (
                <button
                    className="bg-(--oxley-500) text-(--oxley-50) rounded-full transition transform hover:bg-(--primary-dark) hover:scale-105 active:bg-(--oxley-700) active:scale-95"
                    onClick={incrementar}
                >
                    <PlusCircleIcon style={{ width, height }} />
                </button>
            )}
        </>
    );
};

export default CantidadControl;