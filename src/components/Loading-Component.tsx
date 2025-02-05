import React from "react";

const LoadingComponent = () => (
    <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-t-(--verde-azulado) border-(--primary-dark) rounded-full animate-spin"></div>
    </div>
);

export default LoadingComponent;