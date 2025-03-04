'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AvisoLegal() {
    return (
        <div>
            <Navbar />
            <main className="p-6 text-gray-900 max-w-4xl mx-auto my-6">
                <h1 className="text-3xl font-bold mb-6 text-center">Aviso Legal</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">1. Identificación del Titular</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        En cumplimiento con la normativa vigente, se informa que el titular de este sitio web es Delibite, con domicilio en Av. Eduardo Dato 30, 41005  y con número de identificación fiscal 812235948D. Para cualquier consulta, puedes contactarnos a través de:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li><strong>Correo electrónico:</strong> contacto.delibite@gmail.com</li>
                        <li><strong>Teléfono:</strong> +34 600 123 456</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">2. Objeto</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        El presente Aviso Legal regula el uso del sitio web Delibite, cuya finalidad es proporcionar información sobre nuestros productos y servicios, así como facilitar su contratación por parte de los usuarios.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">3. Condiciones de Uso</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Al acceder y navegar por este sitio web, el usuario acepta las condiciones de uso establecidas. En caso de no estar de acuerdo, se recomienda no utilizar el sitio.
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li><strong>Uso lícito:</strong> El usuario se compromete a utilizar el sitio web de forma adecuada y conforme a la legislación vigente.</li>
                        <li><strong>Veracidad de la información:</strong> El usuario garantiza la autenticidad de los datos proporcionados en los formularios de contacto o registro.</li>
                        <li><strong>Prohibiciones:</strong> Queda prohibida la reproducción, distribución o modificación de los contenidos del sitio sin autorización expresa.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">4. Propiedad Intelectual e Industrial</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Todos los contenidos del sitio web, incluyendo textos, imágenes, logotipos y diseños, están protegidos por derechos de propiedad intelectual e industrial. Su uso no autorizado puede constituir una infracción legal.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">5. Responsabilidad</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        El titular del sitio web no se hace responsable de:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li><strong>Interrupciones del servicio:</strong> Derivadas de causas técnicas, mantenimiento o problemas externos.</li>
                        <li><strong>Uso indebido del sitio:</strong> Por parte de los usuarios o terceros.</li>
                        <li><strong>Contenido de terceros:</strong> Enlaces externos que puedan redirigir a otros sitios web fuera de nuestro control.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">6. Protección de Datos Personales</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        El tratamiento de los datos personales de los usuarios se realizará conforme a la Política de Privacidad, garantizando la confidencialidad y seguridad de la información proporcionada.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">7. Modificaciones</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Nos reservamos el derecho de modificar el presente Aviso Legal en cualquier momento para adaptarlo a cambios normativos o mejoras del servicio. Las modificaciones entrarán en vigor en el momento de su publicación en el sitio web.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">8. Legislación y Jurisdicción</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        El presente Aviso Legal se rige por la legislación vigente en España, y cualquier controversia será sometida a los tribunales competentes de Sevilla.
                    </p>
                </section>

                <p className="text-lg leading-relaxed text-justify">
                    Gracias por visitar nuestro sitio web.
                </p>
            </main>
            <Footer />
        </div>
    )
}