"use client";
import "../app/globals.css"
import {Popover, PopoverButton, PopoverPanel} from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import {usePathname} from 'next/navigation'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'
import Link from "next/link";
import React from "react";

const navigation = [
    { name: "Suscripción", explicacion: "Gestiona tu suscripción", href: "/suscripcion", current: false },
    { name: "Catálogo", explicacion: "Explora nuestro catálogo",  href: "/catalogo/productos", current: false },
    { name: "Packs", explicacion: "Descubre nuestros packs",  href: "/packs", current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function NavbarReducido() {
    const pathname = usePathname()

    const router = useRouter()

    return (


        <Popover  as="nav" className="pt-3 sticky top-0 z-50">
            <motion.div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-3/4 bg-white rounded-4xl drop-shadow-lg" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }} >
                <div className="relative flex h-16 items-center ">
                    <div className="max-sm:pl-3 pr-3">
                        <span className="text-4xl text-(--verde-azulado) cursor-pointer" style={{ fontFamily: "Limelight, sans-serif" }} onClick={() => router.push('/')}>
                            delibite
                        </span>
                    </div>
                    <div className="absolute inset-y-0 right-2 flex items-center lg:hidden ">
                        {/* Mobile menu button */}
                        <PopoverButton className="group relative inline-flex items-center justify-center rounded-md p-2 border border-gray-300 active:border-(--verde-azulado)">
                            <span className="sr-only">Abrir menu</span>
                            <Bars3Icon className="block size-6 group-data-open:hidden" aria-hidden="true" />
                            <XMarkIcon className="hidden size-6 group-data-open:block" aria-hidden="true" />
                        </PopoverButton>
                    </div>
                    <div className="hidden lg:flex md:space-x-2 space-x-5 ml-2">
                        {navigation.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                aria-current={pathname === item.href ? "page" : undefined}
                                className={classNames(
                                    pathname === item.href
                                        ? "underline text-(--oxley-700)"
                                        : "text-(--oxley-500) hover:bg-(--oxley-300) active:bg-(--verde-azulado) hover:text-white transition transform active:scale-95 hover:scale-105",
                                    "py-2 px-4 rounded-full text-xl font-medium"
                                )}
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                </div>
            </motion.div>

            <PopoverPanel className="absolute -right-50 -left-50  mt-4 w-96  mx-auto rounded-xl bg-white shadow-lg divide-y divide-gray-200 ">
                <div
                    className="p-3 space-y-3"
                >
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                                pathname === item.href
                                    ? "underline font-bold"
                                    : "block w-full rounded-lg py-2 px-3 text-left transition hover:bg-gray-100 text-gray-900 font-semibold"
                            )}
                        >
                            {item.name}
                            <p className="text-gray-500 text-sm">{item.explicacion}</p>
                        </Link>
                    ))}
                </div>
            </PopoverPanel>
        </Popover>
    )
}