import React from 'react';
import Image from "next/image";

const alergenos = [
    "1.svg", "2.svg", "3.svg", "4.svg", "5.svg", "6.svg", "7.svg", "8.svg", "9.svg", "10.svg", "11.svg", "12.svg", "13.svg", "14.svg",
];

interface AlergenosProps {
    selectedAlergenos: string[];
    setSelectedAlergenos: (alergenos: string[]) => void;
}

const Alergenos: React.FC<AlergenosProps> = ({ selectedAlergenos, setSelectedAlergenos }) => {
    const toggleAlergeno = (alergeno: string) => {
        if (selectedAlergenos.includes(alergeno)) {
            setSelectedAlergenos(selectedAlergenos.filter((item: string) => item !== alergeno));
        } else {
            setSelectedAlergenos([...selectedAlergenos, alergeno]);
        }
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-4">
            {alergenos.map((alergeno, index) => (
                <div
                    key={index}
                    className={`relative p-1 sm:p-2 rounded-full flex items-center justify-center cursor-pointer transition-all 
                ${selectedAlergenos.includes(alergeno) ? 'drop-shadow-[0_5px_3px_var(--verde-azulado)] sm:drop-shadow-[0_10px_5px_var(--verde-azulado)]' : ''}`}
                    onClick={() => toggleAlergeno(alergeno)}
                >
                    <Image
                        src={`/alergenos/${alergeno}`}
                        alt={alergeno.replace('.svg', '')}
                        width={40}
                        height={16}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[50px] lg:h-[50px]"
                    />
                    {selectedAlergenos.includes(alergeno) && (
                        <span
                            className="absolute top-0 right-1 sm:right-3 lg:right-6 bg-green-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                    ✔
                </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Alergenos;
