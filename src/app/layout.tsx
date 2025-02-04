import type { Metadata } from "next";
import "./globals.css";
import React from "react";



export const metadata: Metadata = {
    title: "Delibite",
    description: "Creado por Antonio Nogues y Rodrigo Jaén",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
        <head>
            <link rel="icon" href="/logo.svg"/>
            <title>Delibite</title>
            <style>
                @import url(&#39;https://fonts.googleapis.com/css2?family=Limelight&display=swap&#39;);
            </style>
        </head>
        <body className="antialiased">
        {children}
        </body>
        </html>
    );
}