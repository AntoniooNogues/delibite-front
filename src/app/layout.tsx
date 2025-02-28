import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
    title: "Delibite",
    description: "Creado por Antonio Nogues y Rodrigo Jaén",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <head>
            <link rel="icon" href="/logo.jpg"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
        </head>
        <body className="antialiased">
        {children}
        </body>
        </html>
    );
}
