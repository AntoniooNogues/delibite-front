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
        <div className="grid grid-cols-7 gap-4">
            {alergenos.map((alergeno, index) => (
                <div
                    key={index}
                    className={`relative p-2 rounded-full flex items-center justify-center cursor-pointer transition-all 
                        ${selectedAlergenos.includes(alergeno) ? 'drop-shadow-[0_10px_5px_var(--verde-azulado)]' : ''}`}
                    onClick={() => toggleAlergeno(alergeno)}
                >
                    <Image src={`/alergenos/${alergeno}`} alt={alergeno.replace('.svg', '')} width={50} height={20} />
                    {selectedAlergenos.includes(alergeno) && (
                        <span className="absolute top-0 right-6 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                            ✔
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Alergenos;
