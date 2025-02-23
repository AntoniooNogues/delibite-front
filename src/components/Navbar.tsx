"use client";
import "../app/globals.css";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, UserIcon } from "@heroicons/react/24/outline";
import {usePathname, useRouter} from "next/navigation";
import { motion } from "framer-motion";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import Link from "next/link";

const navigation = [
    { name: "Suscripción", href: "#", current: false },
    { name: "Catálogo", href: "/catalogo/productos", current: false },
    { name: "Packs", href: "/packs", current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {

    const [usuario, setUser] = useState<{ username: string, roles: string[] } | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const [estadoMenu, setMenuEstado] = useState(false);

    const router = useRouter();

    function cerrarSesion(){
        Cookies.remove("token");
        setToken(null);
        router.push("/");
    }



    useEffect(() => {
        const tokenFromCookies = Cookies.get('token');
        setToken(tokenFromCookies || null);

        if (tokenFromCookies) {
            try {
                const tokenDescodificado = jwtDecode<{ username: string, roles: string[] }>(tokenFromCookies);
                setUser(tokenDescodificado);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const controlMenu = () => {
        setMenuEstado(!estadoMenu);
    };

    const pathname = usePathname();

    return (
        <Disclosure as="nav" className="pt-3 sticky top-0 z-50">
            <motion.div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-3/4 bg-white rounded-4xl drop-shadow-lg" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} >
                <div className="relative flex h-16 items-center ">
                    <div className="max-sm:pl-3 pr-3">
                        <span className="text-4xl text-(--verde-azulado) cursor-pointer" style={{ fontFamily: "Limelight, sans-serif" }} onClick={() => router.push('/')}>
                            delibite
                        </span>
                    </div>
                    <div className="absolute inset-y-0 right-2 flex items-center lg:hidden ">
                        {/* Mobile menu button */}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-(--oxley-300) hover:bg-(--primary-dark) hover:text-(--oxley-300) focus:ring-2 focus:(--oxley-300) ">
                            <span className="absolute inset-y-0 right-0 -inset-x-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="hidden lg:flex space-x-5 ml-2">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                aria-current={pathname === item.href ? "page" : undefined}
                                className={classNames(
                                    pathname === item.href
                                        ? "underline text-(--oxley-700)"
                                        : "text-(--oxley-500) hover:bg-(--verde-azulado) active:bg-(--oxley-500) hover:text-white transition transform active:scale-95 hover:scale-105",
                                    "rounded-md px-3 py-2 text-xl font-medium"
                                )}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="flex space-x-4 justify-end w-full max-lg:hidden">
                        {/* Menú de usuario */}
                        <Menu as="div" className="relative">
                            {token ? (
                                    <div>
                                        <MenuButton className="w-11 h-11 p-2 rounded-full text-black bg-(--oxley-300) hover:bg-(--verde-azulado) active:bg-(--oxley-500) transition active:scale-95 hover:scale-105">
                                            <UserIcon className="w-7 h-7" />
                                        </MenuButton>
                                        <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-b-3xl z-50">
                                            <MenuItem>
                                                {({ focus }) => (
                                                    <Link
                                                        href="/perfil"
                                                        className={classNames(
                                                            focus ? "bg-gray-100" : "",
                                                            "block px-4 py-2 text-sm text-gray-700"
                                                        )}
                                                    >
                                                        Perfil
                                                    </Link>
                                                )}
                                            </MenuItem>
                                            <MenuItem>
                                                {({ focus }) => (
                                                    <a
                                                        href="#"
                                                        className={classNames(
                                                            focus ? "bg-gray-100 rounded-b-3xl" : "",
                                                            "block px-4 pt-2 pb-3 text-sm text-gray-700"
                                                        )}
                                                        onClick={cerrarSesion}
                                                    >
                                                        Cerrar sesión
                                                    </a>
                                                )}
                                            </MenuItem>
                                        </MenuItems>
                                    </div>
                            ):(
                                <MenuButton className="text-(--oxley-500) hover:bg-(--verde-azulado) active:bg-(--oxley-500) hover:text-white transition transform active:scale-95 hover:scale-105 rounded-md px-3 py-2 text-xl font-medium " onClick={() => router.push("/login")}>
                                    Iniciar Sesión
                                </MenuButton>
                            )}
                        </Menu>
                    </div>
                </div>
            </motion.div>

            <DisclosurePanel className="lg:hidden bg-white mt-4 m-10 rounded-2xl drop-shadow-lg absolute z-50 w-full max-w-4xl mx-auto">
                <div className="space-y-1 p-4 flex flex-col">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={pathname === item.href ? "page" : undefined}
                            className={classNames(
                                pathname === item.href
                                    ? "underline text-(--oxley-700)"
                                    : "text-(--oxley-500) hover:bg-(--verde-azulado) active:bg-(--oxley-500) hover:text-white active:scale-95 hover:scale-105 flex flex-col",
                                "rounded-md px-3 py-2 text-xl font-medium"
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}

                    {token ? (
                        <button className="text-(--oxley-500) hover:bg-(--verde-azulado) active:bg-(--oxley-500) hover:text-white active:scale-95 hover:scale-105 flex flex-col rounded-md px-3 py-2 text-xl font-medium"
                                onClick={controlMenu}
                        >
                            {usuario?.username}
                        </button>
                    ): (
                        <button onClick={() => router.push("/login")} className="text-(--oxley-500) hover:bg-(--verde-azulado) active:bg-(--oxley-500) hover:text-white active:scale-95 hover:scale-105 flex flex-col rounded-md px-3 py-2 text-xl font-medium">
                            Iniciar Sesión
                        </button>
                    )}
                    {token && estadoMenu &&(
                        <div className="p-2 bg-(--oxley-100) rounded-2xl">
                            <button onClick={() => router.push('/perfil')} className="w-full text-(--oxley-500) hover:bg-(--verde-azulado) active:bg-(--oxley-500) hover:text-white active:scale-95 hover:scale-105 flex flex-col rounded-md px-3 py-2 text-xl font-medium">
                                Perfil
                            </button>
                            <button
                                className="w-full text-(--oxley-500) hover:bg-(--verde-azulado) active:bg-(--oxley-500) hover:text-white active:scale-95 hover:scale-105 flex flex-col rounded-md px-3 py-2 text-xl font-medium"
                                onClick={cerrarSesion}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </DisclosurePanel>

        </Disclosure>
    );
}
