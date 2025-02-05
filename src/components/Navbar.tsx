"use client";
import "../app/globals.css";
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, UserIcon } from "@heroicons/react/24/outline";
import {usePathname, useRouter} from "next/navigation";
import { motion } from "framer-motion";
import React from "react";

const navigation = [
    { name: "Suscripción", href: "#", current: false },
    { name: "Catálogo", href: "/catalogo/productos", current: false },
    { name: "Packs", href: "#", current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
    const pathname = usePathname();

    const router = useRouter();
    return (
        <Disclosure as="nav" className="pt-3 sticky top-0 z-50">
            <motion.div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-3/4 bg-white rounded-4xl drop-shadow-lg" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} >
                <div className="relative flex h-16 items-center ">
                    <div className="sm:flex-none flex-1 flex items-center justify-center sm:items-stretch sm:justify-start mr-3">
                        <span className="text-4xl text-(--verde-azulado) cursor-pointer" style={{ fontFamily: "Limelight, sans-serif" }} onClick={() => router.push('/')}>
                            delibite
                        </span>
                    </div>
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="hidden sm:flex space-x-6 ml-2">
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
                    <div className="flex space-x-4 justify-end w-full">
                        {/* Menú de usuario */}
                        <Menu as="div" className="relative">
                            <MenuButton className="w-11 h-11 p-2 rounded-full text-black bg-(--oxley-300) hover:bg-(--verde-azulado) active:bg-(--oxley-500) transition active:scale-95 hover:scale-105">
                                <UserIcon className="w-7 h-7" />
                            </MenuButton>
                            <MenuItems className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-b-3xl z-50">
                                <MenuItem>
                                    {({ focus }) => (
                                        <a
                                            href="#"
                                            className={classNames(
                                                focus ? "bg-gray-100" : "",
                                                "block px-4 py-2 text-sm text-gray-700"
                                            )}
                                        >
                                            Perfil
                                        </a>
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
                                        >
                                            Cerrar sesión
                                        </a>
                                    )}
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                        {/* Ícono de carrito */}
                        <button className="relative text-gray-600 hover:text-black">
                            <ShoppingCartIcon className="w-11 h-11 p-2 rounded-full text-black bg-(--oxley-300) hover:bg-(--verde-azulado) active:bg-(--oxley-500) transition active:scale-95  hover:scale-105" />
                        </button>
                    </div>
                </div>
            </motion.div>

            <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton
                            key={item.name}
                            as="a"
                            href={item.href}
                            aria-current={pathname === item.href ? "page" : undefined}
                            className={classNames(
                                pathname === item.href
                                    ? "bg-(--verde-azulado) hover:bg-(--oxley-500) active:bg-(--primary-dark) transition text-white"
                                    : "text-black hover:text-white",
                                "block rounded-md px-3 py-2 text-xl font-medium"
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}
