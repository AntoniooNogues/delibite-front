"use client";
import "../app/globals.css"
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import {usePathname} from 'next/navigation'
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion'

const navigation = [
    { name: 'Suscripción', href: '#', current: false },
    { name: 'Catálogo', href: '#', current: false },
    { name: 'Packs', href: '#', current: false },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function NavbarReducido() {
    const pathname = usePathname()

    const router = useRouter()

    return (
        <Disclosure as="nav" className="pt-6 bg-(--gris-registro)">
            <motion.div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 w-3/4 bg-white rounded-4xl" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                <div className="relative flex h-16 items-center justify-start">
                    <div className="sm:flex-none flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <span className="text-4xl text-(--verde-azulado) cursor-pointer" style={{ fontFamily: 'Limelight, sans-serif' }} onClick={() => router.push('/')}>delibite</span>
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
                    <div className="hidden sm:ml-6 sm:block">
                        <div className="flex space-x-4">
                            {navigation.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    aria-current={pathname === item.href ? 'page' : undefined}
                                    className={classNames(
                                        pathname === item.href ? 'bg-(--verde-azulado-80) text-white' : 'text-black hover:bg-(--verde-azulado-80) active:bg-(--oxley-500)  hover:text-white',
                                        'rounded-md px-3 py-2 text-xl font-medium',
                                    )}
                                >
                                    {item.name}
                                </a>
                            ))}
                        </div>
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
                            aria-current={pathname === item.href ? 'page' : undefined}
                            className={classNames(
                                pathname === item.href ? 'bg-(--verde-azulado-80) text-white' : 'text-black hover:bg-(--verde-azulado-80) hover:text-white',
                                'block rounded-md px-3 py-2 text-xl font-medium',
                            )}
                        >
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}