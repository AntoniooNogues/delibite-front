import Navbar from "@/components/Navbar"
import Image from "next/image";

export default function Home() {
    return (
        <div className="fondo min-h-screen">
            <Navbar></Navbar>
            <div className=" flex flex-col items-center justify-center w-full">
                <Image src={"/catDance-4x.gif"} alt={"gato feliz"} width="200" height="200"></Image>
                <h2 className="text-4xl">Pagina en construcción😁👍</h2>
            </div>

            <br/>
        </div>
    );
}