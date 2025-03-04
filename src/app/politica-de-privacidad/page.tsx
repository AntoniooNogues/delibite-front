'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PoliticaDePrivacidad(){
    return (
        <div>
            <Navbar/>
            <main className="p-6 text-gray-900 max-w-4xl mx-auto my-6">
                <h1 className="text-3xl font-bold mb-6 text-center">Política de Privacidad</h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">1. Introducción</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Bienvenido a <strong>Delibite</strong>. La protección de tu privacidad es una de nuestras prioridades. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestro sitio web y servicios.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">2. Información que Recopilamos</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Podemos recopilar los siguientes tipos de información:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li><strong>Datos personales:</strong> Nombre, dirección, correo electrónico, teléfono, información de pago.</li>
                        <li><strong>Datos de uso:</strong> Información sobre tu interacción con nuestro sitio web, como direcciones IP, tipo de navegador y páginas visitadas.</li>
                        <li><strong>Cookies y tecnologías similares:</strong> Utilizamos cookies para mejorar tu experiencia de navegación y personalizar nuestros servicios.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">3. Uso de la Información</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        La información recopilada se utiliza para:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li>Procesar pedidos y gestionar entregas.</li>
                        <li>Mejorar la experiencia del usuario y optimizar nuestros servicios.</li>
                        <li>Enviar comunicaciones promocionales, siempre con tu consentimiento.</li>
                        <li>Garantizar la seguridad del sitio web y prevenir fraudes.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">4. Compartición de Datos</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        No compartimos tu información personal con terceros, excepto en los siguientes casos:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan en el procesamiento de pagos, envíos y atención al cliente.</li>
                        <li><strong>Requerimientos legales:</strong> Si es necesario para cumplir con la legislación aplicable o una orden judicial.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">5. Seguridad de la Información</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Implementamos medidas de seguridad para proteger tus datos contra accesos no autorizados, pérdidas o alteraciones. Sin embargo, no podemos garantizar una seguridad absoluta en internet.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">6. Derechos del Usuario</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Como usuario, tienes derecho a:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li>Acceder, rectificar o eliminar tus datos personales.</li>
                        <li>Solicitar la limitación del tratamiento de tus datos.</li>
                        <li>Retirar tu consentimiento en cualquier momento.</li>
                    </ul>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Para ejercer estos derechos, puedes contactarnos en soporte@delibite.com.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">7. Modificaciones en la Política de Privacidad</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Nos reservamos el derecho de modificar esta política en cualquier momento. Cualquier cambio será publicado en esta página y entrará en vigencia inmediatamente.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">8. Contacto</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Si tienes dudas sobre esta Política de Privacidad, puedes contactarnos a través de:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li><strong>Correo electrónico:</strong> soporte@delibite.com</li>
                        <li><strong>Teléfono:</strong> +34 600 123 456</li>
                        <li><strong>Horario de atención:</strong> Lunes a Viernes de 9:00 a 18:00</li>
                    </ul>
                </section>

                <p className="text-lg leading-relaxed text-justify">
                    Gracias por confiar en <strong>Delibite</strong>.
                </p>
            </main>
            <Footer />
        </div>
    )
}