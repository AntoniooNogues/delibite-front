'use client';
import React from 'react';
import Navbar from "@/components/Navbar";

export default function PerfilLayout(props: { children: React.ReactNode }) {
    return (
        <div className="h-screen space-y-4">
            <Navbar></Navbar>
            <div className="flex justify-center p-5 m-0 rounded-2xl mb-4">
                <div className="w-5/6">
                    {props.children}
                </div>
            </div>
        </div>
    );
}