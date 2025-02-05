import React from 'react';
import { PlusCircleIcon } from '@heroicons/react/20/solid';
import { MinusCircleIcon } from "@heroicons/react/20/solid";



interface CantidadControlProps {
    itemId: number;
    cantidad: number;
    handleCantidadChange: (id: number, value: number) => void;
}

const CantidadControl: React.FC<CantidadControlProps> = ({ itemId, cantidad, handleCantidadChange }) => {
    return (
        <>
            {cantidad ? (
                <div className="flex items-center justify-between bg-(--oxley-400) rounded-full p-2">
                    <button
                        className="bg-(--oxley-500) text-(--oxley-50) rounded-full transition transform hover:bg-(--primary-dark) hover:scale-105 active:bg-(--oxley-700) active:scale-95"
                        onClick={() => handleCantidadChange(itemId, cantidad - 1)}
                    >
                        <MinusCircleIcon className="h-10 w-10"/>
                    </button>
                    <span className="mx-4 font-extrabold rounded-full bg-white w-10 h-10 flex items-center justify-center">
                        {cantidad}
                    </span>

                    <button
                        className="bg-(--oxley-500) text-(--oxley-50) rounded-full transition transform hover:bg-(--primary-dark) hover:scale-105 active:bg-(--oxley-700) active:scale-95"
                        onClick={() => handleCantidadChange(itemId, cantidad + 1)}
                    >
                        <PlusCircleIcon className="h-10 w-10"/>
                    </button>
                </div>

            ) : (
                <button
                    className="bg-(--oxley-500) text-(--oxley-50) rounded-full transition transform hover:bg-(--primary-dark) hover:scale-105 active:bg-(--oxley-700) active:scale-95"
                    onClick={() => handleCantidadChange(itemId, 1)}
                >
                    <PlusCircleIcon className="h-10 w-10"/>
                </button>
            )}
        </>
    );
};

export default CantidadControl;