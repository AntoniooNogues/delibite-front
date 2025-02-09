import Navbar from "@/components/Navbar"
import Image from "next/image";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <div className="fondo flex flex-col min-h-screen">
            <Navbar></Navbar>
            <div className=" flex flex-col flex-1 items-center justify-center w-full">
                <Image src={"/catDance-4x.gif"} alt={"gato feliz"} width="200" height="200"></Image>
                <h2 className="text-4xl">Pagina en construcción😁👍</h2>
            </div>

            <br/>
            <Footer></Footer>
        </div>
    );
}