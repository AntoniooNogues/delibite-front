import React from "react";

const Loading = () => (
    <div className="w-full h-full flex items-center justify-center">
        {/* Contenedor del spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute w-full h-full border-[5px] border-t-[var(--verde-azulado)] border-[var(--primary-dark)] rounded-full animate-spin" />
        </div>
    </div>
);
export default Loading;