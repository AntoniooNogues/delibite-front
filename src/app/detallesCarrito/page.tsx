"use client";
import {motion} from "framer-motion";
import Navbar from "@/components/Navbar";
import React, {useEffect, useState} from "react";
import Cookies from "js-cookie";
import CantidadControl from "@/components/BotonAddPlato-Component";
import Image from "next/image";
import {Trash} from "lucide-react";
import { Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Button } from "@mui/material";
import Footer from "@/components/Footer";
import FormularioPago from "@/components/FormularioPago";
import { useTokenExpirado } from "@/hooks/useTokenExpirado";
import NotificacionComponent from "@/components/Notificacion-Component";
import {Notificaciones} from "@/interfaces/Notificaciones";


export default function DetallesCarrito() {
    const [carrito, setCarrito] = useState<{ [key: number]: { nombre: string, precio: number, cantidad: number } }>({});
    const [notificacion, setNotificacion] = useState<Notificaciones | null>(null);
    setNotificacion(useTokenExpirado());

    useEffect(() => {
        const updateCarrito = () => {
            const carritoGuardado = Cookies.get("carrito");
            if (carritoGuardado) {
                setCarrito(JSON.parse(carritoGuardado));
            }
        };

        updateCarrito();

        const intervalId = setInterval(updateCarrito, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    const handleCantidadChange = (id: number, value: number) => {
        setCarrito(prev => {
            const newCarrito = { ...prev };
            if (value > 0) {
                newCarrito[id].cantidad = value;
            } else {
                delete newCarrito[id];
            }

            Cookies.set("carrito", JSON.stringify(newCarrito), { expires: 7 });

            const event = new CustomEvent("actualizacionCarrito", { detail: newCarrito });
            window.dispatchEvent(event);

            return newCarrito;
        });
    };
    const borrarProducto = (id: number) => {
        setCarrito(prev => {
            const newCarrito = {...prev};
            delete newCarrito[id];
            Cookies.set("carrito", JSON.stringify(newCarrito), { expires: 7 });

            const event = new CustomEvent("actualizacionCarrito", {detail: newCarrito});
            window.dispatchEvent(event);
            handleClose();
            return newCarrito;
        });
    };
    const [open, setOpen] = React.useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const handleClickOpen = (id: number) => {
        setSelectedId(id);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedId(null);
    };
    const totalCarrito = Object.values(carrito).reduce((total, { precio, cantidad }) => total + (precio * cantidad), 0);
    const [mostrarFormularioPago, setMostrarFormularioPago] = useState(false);
    const handleFinalizarCompra = () => {
        setMostrarFormularioPago(true);
    };
    const [pais, setPais] = useState("España");
    const calcularEnvio = () => {
        switch (pais) {
            case "España":
                return 5.00;
            case "Portugal":
                return 7.00;
            case "Francia":
                return 10.00;
            default:
                return 0;
        }
    };
    const precioEnvio = calcularEnvio();
    const totalConEnvio = totalCarrito + precioEnvio;
    return (
        <div>
            <Navbar></Navbar>
            <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
                {/* Mostrar productos */}
                <div className="mt-8 mx-auto w-5/6 flex space-x-6 mb-12">
                    <div className="w-2/3 bg-white p-6 rounded-2xl shadow-lg">
                        <span className="text-2xl">
                            Mi carrito
                        </span>
                        <hr/>
                        <div className="space-y-2 mt-2 ">
                            {Object.keys(carrito).length > 0 ? (
                                Object.entries(carrito).map(([id, { nombre, precio, cantidad }], i) => {
                                    return (
                                        <div
                                            key={id}
                                            className={`flex flex-col justify-between p-4 rounded-lg  ${
                                                i % 2 === 0 ? 'bg-white' : 'bg-[var(--gris-muy-claro)]'
                                            }`}
                                        >
                                            <div className="flex justify-between items-center space-x-4" style={{ flexShrink: 0 }}>
                                                <div>
                                                    <Image src={"/catalogo/papas_arrugas.webp"} alt={"Imagen producto"} className="rounded-lg" width={140} height={70}></Image>
                                                </div>
                                                <div className="flex flex-1 items-center space-x-4">
                                                    <p className="text-lg font-semibold">{nombre}</p>
                                                    <p className="text-md">
                                                        {precio}€
                                                    </p>
                                                </div>
                                                <div className="min-w-2 shrink-0 ">
                                                    <CantidadControl
                                                        itemId={parseInt(id)}
                                                        cantidadInicial={cantidad}
                                                        handleCantidadChange={(itemId, value) => handleCantidadChange(itemId, value)}
                                                        width={30}
                                                        height={30}
                                                    />
                                                </div>
                                                <div className="min-w-3 shrink-0 ">
                                                    <p className="font-bold">
                                                        {(cantidad * precio).toFixed(2)}€
                                                    </p>
                                                </div>
                                                <div>
                                                    <button
                                                        onClick={() => handleClickOpen(parseInt(id))}
                                                        className="bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-700 active:bg-red-900 transition transform active:scale-95 hover:scale-105 focus:outline-none"
                                                    >
                                                        <Trash size={16}/>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-600 text-center">No hay productos en el carrito.</p>
                            )}
                        </div>
                        <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                            sx={{
                                '& .MuiDialog-paper': {
                                    backgroundColor: 'var(--oxley-50)',
                                    color: 'var(--oxley-900)',
                                    borderRadius: '10px',
                                    padding: '20px',
                                },
                            }}
                        >
                            <DialogTitle id="alert-dialog-title">{"Confirmar eliminación"}</DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    ¿Estás seguro de que deseas eliminar este producto del carrito?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    onClick={handleClose}
                                    sx={{
                                        backgroundColor: 'var(--verde-azulado)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'var(--primary-dark)',
                                            transform: 'scale(1.05)'
                                        },
                                        '&:active': {
                                            backgroundColor: 'var(--oxley-800)',
                                            transform: 'scale(0.95)',
                                        },
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={() => selectedId !== null && borrarProducto(selectedId)}
                                    autoFocus
                                    sx={{
                                        backgroundColor: 'var(--danger-400)',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: 'var(--danger-600)',
                                            transform: 'scale(1.05)'
                                        },
                                        '&:active': {
                                            backgroundColor: 'var(--danger-800)',
                                            transform: 'scale(0.95)',
                                        },
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
                                    }}
                                >
                                    Eliminar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <div className="w-1/3 bg-white p-6 rounded-2xl shadow-lg max-h-86">
                        <span className="text-2xl">
                            Resumen del pedido
                        </span>
                        <hr/>
                        <div className="mt-4">
                            <div className="flex text-lg justify-between">
                                <p>Subtotal: </p>
                                <p>
                                    {(totalCarrito - (totalCarrito * 0.21)).toFixed(2)}
                                </p>
                            </div>
                            <div className="flex text-lg justify-between">
                                <p>Tax: </p>
                                <p> {(totalCarrito * 0.21).toFixed(2)} </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p
                                className="underline hover:scale-105 active:scale-95"
                            >
                                Calcular envío
                            </p>
                            <select value={pais} onChange={(e) => setPais(e.target.value)}
                                    className="mt-2 p-2 border rounded">
                                <option value="España">España</option>
                                <option value="Portugal">Portugal</option>
                                <option value="Francia">Francia</option>
                            </select>
                        </div>
                        <div className="flex justify-between text-xl mt-8">
                            <p className="font-bold">Total: </p>
                            <p className="font-bold">{(totalConEnvio).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-center w-full mt-12">
                            <button
                                onClick={handleFinalizarCompra}
                                className="px-4 py-3 bg-(--oxley-300) hover:bg-(--verde-azulado)
                            active:bg-(--oxley-500) transition transform hover:scale-105 active:scale-95 w-full rounded-2xl font-bold">
                                Finalizar compra
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
            {mostrarFormularioPago && <FormularioPago setMostrarFormularioPago={setMostrarFormularioPago} totalConEnvio={totalConEnvio}  />}
            <Footer></Footer>

            {notificacion && (
                <NotificacionComponent
                    Notificaciones={notificacion}
                    onClose={() => setNotificacion(null)}
                />
            )}
        </div>
    );
}
