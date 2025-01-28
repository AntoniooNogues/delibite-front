"use client";

import React, { useState } from "react";

const SettingsPage = () => {
    const [file, setFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (data.url) {
            setImageUrl(data.url);
        }
    };

    return (
        <div>
            <h1>Settings</h1>
            <form onSubmit={handleUpload}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button type="submit">Upload</button>
            </form>
            {imageUrl && <img src={imageUrl} alt="Uploaded image" />}
        </div>
    );
};

export default SettingsPage;
