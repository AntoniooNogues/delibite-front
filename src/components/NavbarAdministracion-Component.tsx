import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {useRouter, usePathname} from 'next/navigation';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
import {motion} from 'framer-motion';
import Link from 'next/link';

interface SideBarAdminProps {
    className?: string
}

export default function SideBarAdmin({className}: SideBarAdminProps) {
    const [usuario, setUser] = useState<{ username: string, roles: string[] } | null>(null);
    const [showLogout, setShowLogout] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const tokenUsuario = Cookies.get('token');
        if (tokenUsuario) {
            try {
                const tokenDescodificado = jwtDecode<{ username: string, roles: string[] }>(tokenUsuario);
                setUser(tokenDescodificado);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, [router]);

    const handleLogout = () => {
        Cookies.remove('token');
        router.push('/administracion/login');
    };

    return (
        <main className={`flex items-center w-fit min-h-screen p-10  ${className}`}>
            <div
                className="flex flex-col items-start w-40 h-full overflow-hidden text-(--oxley-200) bg-(--oxley-900) rounded-2xl">
                <Link className="flex items-center w-full px-3 mt-3" href="/">
                    <span className="ml-2 text-2xl font-bold text-(--verde-azulado)"
                          style={{fontFamily: "Limelight, sans-serif"}}>delibite</span>
                </Link>
                <div className="w-full px-2">
                    <div className="flex flex-col items-center w-full mt-3 border-t border-[--oxley-700] gap-2">
                        <Link className={`flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-[--oxley-800] hover:text-[--oxley-50] ${pathname === '/administracion' ? 'bg-[--primary-dark]' : ''}`}
                           href="/administracion">
                            <span className="text-lg font-medium">Inicio</span>
                        </Link>
                        <Link className={`flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-[--oxley-800] hover:text-[--oxley-50] ${pathname === '/administracion/usuarios' ? 'bg-[--primary-dark]' : ''}`}
                           href="/administracion/usuarios">
                            <span className="text-lg font-medium">Usuarios</span>
                        </Link>
                        <Link className={`flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-[--oxley-800] hover:text-[--oxley-50] ${pathname === '/administracion/platos' ? 'bg-[--primary-dark]' : ''}`}
                           href="/administracion/platos">
                            <span className="text-lg font-medium">Platos</span>
                        </Link>
                        <Link className={`flex items-center w-full h-12 px-3 mt-2 text-[--oxley-50] rounded ${pathname === '/administracion/pedidos' ? 'bg-[--primary-dark]' : ''}`}
                           href="/administracion/">
                            <span className="text-lg font-medium">Pedidos</span>
                        </Link>
                    </div>
                    <div className="flex flex-col items-center w-full mt-2 border-t border-[--oxley-700]">
                        <Link className={`flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-[--oxley-800] hover:text-[--oxley-50] ${pathname === '/administracion/packs' ? 'bg-[--primary-dark]' : ''}`}
                           href="/administracion/packs">
                            <span className="text-lg font-medium">Packs</span>
                        </Link>
                        <Link className={`flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-[--oxley-800] hover:text-[--oxley-50] ${pathname === '/administracion/valoraciones' ? 'bg-[--primary-dark]' : ''}`}
                           href="/administracion/">
                            <span className="text-lg font-medium">Valoraciones</span>
                        </Link>
                        <Link className={`flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-[--oxley-800] hover:text-[--oxley-50] ${pathname === '/administracion/suscripciones' ? 'bg-[--primary-dark]' : ''}`}
                           href="/administracion/">
                            <span className="text-lg font-medium">Suscripciones</span>
                        </Link>
                    </div>
                </div>
                <div className="relative w-full mt-auto">
                    <button
                        className="flex items-center w-full h-16 mt-auto bg-(--oxley-800) hover:bg-(--oxley-700) hover:text-(--oxley-50) px-4"
                        onClick={() => setShowLogout(!showLogout)}
                    >
                        <Image
                            src={usuario?.roles.includes('ROLE_ADMINISTRADOR') ? "/iconos/icon-administrador.png" : "/iconos/icon-supervisor.png"}
                            width={24} height={24} alt="Icono del usuario"/>
                        <span className="ml-2 text-md font-medium">{usuario?.username} <span className="mt-2 text-sm font-medium">{usuario?.roles.map(role => role.replace('ROLE_', '').charAt(0) + role.replace('ROLE_', '').slice(1).toLowerCase()).join(', ')}</span></span>
                    </button>
                    {showLogout && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            className="absolute bottom-full w-full h-12 px-3 my-2 rounded bg-(--oxley-800) text-(--oxley-50)"
                        >
                            <button onClick={handleLogout} className="w-full h-full flex items-center justify-center">
                                Cerrar sesión
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
}