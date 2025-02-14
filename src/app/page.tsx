'use client';

import Navbar from "@/components/Navbar";
import Image from "next/image";
import Footer from "@/components/Footer";
import Carrito from "@/components/Carrito";
import { motion } from "framer-motion";

export default function Home() {
    return (
        <div>
            <div className="fondo flex flex-col min-h-screen">
                <Navbar />
                <div className="flex flex-col flex-1 items-center justify-center w-full">
                    <h2 className="text-4xl mb-4">Pagina en construcción</h2>

                    <motion.div
                        className="flex flex-row gap-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 10 }}
                    >
                        <Image src={"/NOOOO-4x.gif"} alt={"gato feliz"} width={200} height={200} />
                        <Image src={"/WHAT-4x.avif"} alt={"gato feliz"} width={200} height={200} />
                    </motion.div>
                </div>

                <br />
                <Carrito />
            </div>
            <Footer />
        </div>
    );
}
