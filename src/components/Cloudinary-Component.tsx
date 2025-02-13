import React, { useState } from "react";
import axiosClient from "@/lib/axiosClient";

interface CloudinaryUploadProps {
    onUploadComplete: (url: string) => void;
}

const CloudinaryUpload: React.FC<CloudinaryUploadProps> = ({ onUploadComplete }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosClient.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (response.data.url) {
            onUploadComplete(response.data.url);
        }
    };

    return (
        <div>
            <form onSubmit={handleUpload} className="flex flex-col gap-2">
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer border rounded-md p-4 inline-block text-black/60 font-roboto font-normal text-base"
                >
                    {file ? file.name : 'Seleccionar archivo'}
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="my-4 flex justify-center">
                    <button type="submit" className="px-4 py-2 bg-(--oxley-500) text-white rounded-lg hover:bg-(--primary-dark) hover:scale-105 active:scale-95 transition-transform w-full">
                        Subir
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CloudinaryUpload;