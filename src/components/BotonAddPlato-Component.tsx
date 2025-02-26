import React, {useEffect, useState} from 'react';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { MinusCircleIcon } from "@heroicons/react/20/solid";



interface CantidadControlProps {
    itemId: number;
    cantidadInicial: number;
    handleCantidadChange: (id: number, value: number) => void;
    width: number;
    height: number;
}

const CantidadControl: React.FC<CantidadControlProps> = ({ itemId, cantidadInicial, handleCantidadChange, width, height }) => {
    const [cantidad, setCantidad] = useState(cantidadInicial);

    useEffect(() => {
        setCantidad(cantidadInicial);
    }, [cantidadInicial]);

    return (
        <>
            {cantidad ? (
                <div className="flex items-center justify-between bg-(--oxley-400) rounded-full ">
                    <button
                        className="bg-(--oxley-500) text-(--oxley-50) rounded-full transition transform hover:bg-(--primary-dark) hover:scale-105 active:bg-(--oxley-700) active:scale-95"
                        onClick={() => handleCantidadChange(itemId, cantidad - 1)}
                    >
                        <MinusCircleIcon style={{width, height}}/>
                    </button>
                    <span className="mx-4 font-extrabold rounded-full bg-white flex items-center justify-center" style={{ width, height }}>
                        {cantidad}
                    </span>

                    <button
                        className="bg-(--oxley-500) text-(--oxley-50) rounded-full transition transform hover:bg-(--primary-dark) hover:scale-105 active:bg-(--oxley-700) active:scale-95"
                        onClick={() => handleCantidadChange(itemId, cantidad + 1)}
                    >
                        <PlusCircleIcon style={{ width, height }}/>
                    </button>
                </div>

            ) : (
                <button
                    className="bg-(--oxley-500) text-(--oxley-50) rounded-full transition transform hover:bg-(--primary-dark) hover:scale-105 active:bg-(--oxley-700) active:scale-95"
                    onClick={() => handleCantidadChange(itemId, 1)}
                >
                    <PlusCircleIcon style={{ width, height }}/>
                </button>
            )}
        </>
    );
};

export default CantidadControl;