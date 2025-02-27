import React from 'react';

type InputLabelElementos = {
    label: string;
    name: string;
    type: string;
    onChange: () => void;
};

const InputLabel: React.FC<InputLabelElementos> = ({ label, name, type, onChange}) => {
    return (
        <div className="flex flex-row justify-between items-center">
            <label className="text-gray-700 w-fit">
                {label}
            </label>
            <input type={type} name={name} className="border accent-(--oxley-500) rounded-full w-5 h-5" onChange={onChange}/>
        </div>
    );
};

export default InputLabel;