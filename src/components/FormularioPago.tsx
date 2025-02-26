import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { Nfc, X } from 'lucide-react';
import Loading from "./Loading-Component";
import axiosClient from "../lib/axiosClient";
import axios from "axios";
import Cookies from "js-cookie";
import {Notificaciones} from "@/interfaces/Notificaciones";
import NotificacionComponent from "@/components/Notificacion-Component";
import ProtectedRouteCliente from "@/components/ProtectedRouteCliente";


interface FormularioPagoProps {
    setMostrarFormularioPago: (value: boolean) => void;
    totalConEnvio: number;
}

export default function FormularioPago({ setMostrarFormularioPago, totalConEnvio }: FormularioPagoProps) {
    const [formData, setFormData] = useState({
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardHolder: "",
        paypalEmail: "",
        paypalPassword: "",
    });

    const [isFlipped, setIsFlipped] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("card");
    const [cardType, setCardType] = useState("visa");

    const controls = useAnimation();
    const iconControls = useAnimation();

    useEffect(() => {
        const intervalId = setInterval(() => {
            controls.start({
                rotate: [0, 10, -10, 10, -10, 0],
                transition: { duration: 0.6 }
            });
            iconControls.start({
                scale: [1, 1.2, 1],
                transition: { duration: 0.6 }
            });
        }, 3000);


        return () => clearInterval(intervalId);
    }, [controls, iconControls]);

    const handleChange = (e: { target: { name: string; value: string; }; }) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const [isLoading, setIsLoading] = useState(false);
    const [notificacion, setNotificacion] = useState<Notificaciones>();

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);

        const carrito = Cookies.get("carrito");
        const datosPago = {
            carrito: carrito ? JSON.parse(carrito) : {},
            totalConEnvio,
        };

        try {
            const respuesta = await axiosClient.post("/pedido/realizar", datosPago);
            setNotificacion({ titulo: respuesta.data.titulo, mensaje: respuesta.data.mensaje, code: respuesta.data.code, tipo: respuesta.data.code });
            console.log(respuesta.data);
            setTimeout(() => {
                setMostrarFormularioPago(false);
                window.location.reload();
            }, 2500);
            Cookies.remove("carrito");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setNotificacion({ titulo: error.response.data.titulo, mensaje: error.response.data.mensaje , code: error.response.data.code, tipo: error.response.data.tipo });
            } else {
                setNotificacion({ titulo: 'Error', mensaje: 'Error al crear el plato: Error desconocido', code: 500, tipo: 'error' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const toggleCardType = () => {
        setCardType((prevType) => (prevType === "visa" ? "mastercard" : "visa"));
    };

    const handleCardClick = () => {
        setIsFlipped(!isFlipped);
        controls.start({
            rotateY: isFlipped ? 0 : 180,
            transition: { duration: 0.6 }
        });
    };

    return (
        <ProtectedRouteCliente>
            <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.75)] z-50">
                {isLoading ? (
                    <Loading/>
                ) : (
                    <div className={`bg-white p-6 flex flex-col rounded-lg shadow-lg w-2/3 relative`}>
                        <button className="absolute top-4 right-4"
                                onClick={() => setMostrarFormularioPago(false)}>
                            <X className="text-(--oxley-500) hover:text-(--primary-dark)
                    active:text-(--oxley-700) transition transform active:scale-95 hover:scale-105"/>
                        </button>

                        <div className="flex w-full justify-center items-center mb-4">
                            <h2 className="text-xl font-semibold">Forma de pago</h2>
                            <div className="flex gap-4 ms-4">
                                <button
                                    className={`p-2 rounded-lg ${paymentMethod === "card" ? "bg-(--verde-azulado) text-white " +
                                        "hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:scale-105 active:scale-95" : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 hover:scale-105 active:scale-95"}`}
                                    onClick={() => setPaymentMethod("card")}
                                >
                                    Card
                                </button>
                                <button
                                    className={`p-2 rounded-lg ${paymentMethod === "paypal" ? "bg-(--verde-azulado) text-white " +
                                        "hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:scale-105 active:scale-95" : "bg-gray-200 hover:bg-gray-300 active:bg-gray-400 hover:scale-105 active:scale-95"}`}
                                    onClick={() => setPaymentMethod("paypal")}
                                >
                                    PayPal
                                </button>
                            </div>
                        </div>

                        {paymentMethod === "card" ? (
                            <div className="flex">
                                <div className="w-1/2 flex flex-col items-center justify-center">
                                    <motion.div
                                        className={`relative w-96 h-56 rounded-lg shadow-lg mb-6 cursor-pointer ${cardType === "visa" ? "bg-(--azul-visa)" : "bg-red-600"}`}
                                        initial={{rotateY: 0}}
                                        animate={controls}
                                        transition={{duration: 0.6}}
                                        onClick={handleCardClick}
                                        style={{transformStyle: "preserve-3d"}}
                                    >
                                        {!isFlipped ? (
                                            <div
                                                className="absolute inset-0 flex flex-col justify-between p-4 text-white rounded-lg"
                                                style={{backfaceVisibility: "hidden"}}>
                                                <div className="absolute bottom-2 right-4">
                                                    <Image width={40} height={80}
                                                           src={cardType === "visa" ? "/iconos/visa.svg" : "/iconos/mastercard.svg"}
                                                           alt="Card Logo" className="mt-2"/>
                                                </div>
                                                <div className="absolute top-4 right-4">
                                                    <Nfc size={30}/>
                                                </div>
                                                <div
                                                    className="text-2xl font-bold">{cardType === "visa" ? "Visa" : "Mastercard"}</div>
                                                <div>
                                                    <Image src={"/iconos/chip.png"} alt={"Chip tarjeta"} width={50}
                                                           height={20}></Image>
                                                </div>
                                                <div>
                                                    <div
                                                        className="text-xl tracking-widest font-bold">{formData.cardNumber || "1234 5678 9012 3456"}</div>
                                                    <div className="flex justify-between text-sm">
                                                        <span>{formData.expiryDate || "MM/YY"}</span>
                                                    </div>
                                                    <div
                                                        className="text-lg">{formData.cardHolder || "Juan Ávila"}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="absolute inset-0 bg-gray-800 text-white rounded-lg p-4 flex flex-col justify-between"
                                                style={{transform: "rotateY(180deg)", backfaceVisibility: "hidden"}}>
                                                <div className="w-full h-10 bg-black mt-2"></div>
                                                <div
                                                    className="mt-4 bg-white text-black p-2 rounded-lg flex justify-between items-center">
                                                <span
                                                    className="text-sm font-semibold">{formData.cardHolder || "Juan Ávila"}</span>
                                                    <span className="text-lg">{formData.cvv || "***"}</span>
                                                </div>
                                                <p className="text-xs mt-2 text-gray-300">This is a secure card. Do not
                                                    share your details.</p>
                                            </div>
                                        )}
                                    </motion.div>
                                    <div>
                                        <p className="text-sm text-gray-400">*Tarjeta interactiva</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-end w-1/2">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4 relative">
                                            <div>
                                                <label className="block text-gray-700">Número de tarjeta</label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border rounded-lg"
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength={19}
                                                    pattern="\d{4} \d{4} \d{4} \d{4}"
                                                    required
                                                />
                                                <motion.div
                                                    className="absolute right-0 top-7 mr-2"
                                                    animate={iconControls}
                                                >
                                                    <Image
                                                        width={20}
                                                        height={20}
                                                        src={cardType === "visa" ? "/iconos/visa.svg" : "/iconos/mastercard.svg"}
                                                        alt={cardType === "visa" ? "Visa" : "Mastercard"}
                                                        className="w-12 h-8 cursor-pointer"
                                                        onClick={toggleCardType}
                                                    />
                                                </motion.div>
                                            </div>
                                            <div className="flex justify-end w-full mt-0.5">
                                                <p className="text-gray-600 text-sm"> Haga click en el logo para cambiar
                                                    de
                                                    tarjeta</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 mb-4">
                                            <div className="w-1/2">
                                                <label className="block text-gray-700">Fecha de expiración</label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={formData.expiryDate}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border rounded-lg"
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    pattern="(0[1-9]|1[0-2])\/\d{2}"
                                                    required
                                                />
                                            </div>
                                            <div className="w-1/2">
                                                <label className="block text-gray-700">CVV</label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleChange}
                                                    className="w-full p-2 border rounded-lg"
                                                    placeholder="123"
                                                    maxLength={3}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">Nombre del titular</label>
                                            <input
                                                type="text"
                                                name="cardHolder"
                                                value={formData.cardHolder}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-lg"
                                                placeholder="Juan Ávila"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-(--verde-azulado) text-white p-2 rounded-lg transition hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:scale-105 active:scale-95"
                                        >
                                            Pagar con {cardType}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full">
                                <div className="flex items-center justify-center w-1/2">
                                    <Image src={"/iconos/paypal.svg"} alt={"Paypal"} height={100} width={80}
                                           className="w-80"></Image>
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <form onSubmit={handleSubmit} className="w-full">
                                        <div className="mb-4">
                                            <label className="block text-gray-700">Correo Paypal</label>
                                            <input
                                                type="email"
                                                name="paypalEmail"
                                                value={formData.paypalEmail}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-lg"
                                                placeholder="example@paypal.com"
                                                required
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-gray-700">Contraseña PayPal</label>
                                            <input
                                                type="password"
                                                name="paypalPassword"
                                                value={formData.paypalPassword}
                                                onChange={handleChange}
                                                className="w-full p-2 border rounded-lg"
                                                placeholder="********"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full bg-(--verde-azulado) text-white p-2 rounded-lg transition hover:bg-(--oxley-500) active:bg-(--oxley-700) hover:scale-105 active:scale-95"
                                        >
                                            Pagar con Paypal
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {notificacion && (
                    <NotificacionComponent
                        Notificaciones={notificacion}
                        onClose={() => setNotificacion(undefined)}
                    />
                )}
            </div>
        </ProtectedRouteCliente>
    );
}