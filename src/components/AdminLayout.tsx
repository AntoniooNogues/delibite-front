'use client';
import React from 'react';
import SideBarAdmin from "@/components/NavbarAdministracion";

export default function AdminLayout(props: { children: React.ReactNode }) {
    return (
        <div className="bg-(--oxley-950) flex flex-row w-screen h-screen">
            <SideBarAdmin className="w-fit"/>
            <div className="w-5/6 p-5 m-10 border-2 border-white rounded-2xl bg-(--oxley-800) max-h-[95vh] overflow-y-auto overflow-x-auto">
                {props.children}
            </div>
        </div>
    );
}