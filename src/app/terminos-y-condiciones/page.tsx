'use client';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TerminosYCondiciones(){
    return (
        <div>
            <Navbar/>
            <main className="p-6 text-gray-900 max-w-4xl mx-auto my-6">
                <h1 className="text-3xl font-bold mb-6 text-center">Términos y Condiciones de Uso</h1>
                <p className="mb-6 text-lg leading-relaxed text-justify">
                    Bienvenido a Delibite. Al acceder o utilizar nuestro sitio web, aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con estos términos, te recomendamos que no utilices nuestro servicio.
                </p>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">2. Uso del Servicio</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Delibite proporciona un servicio de entrega de alimentos frescos y de calidad. Al utilizar nuestro servicio, aceptas:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li>Usar nuestro sitio web solo con fines legales y de acuerdo con todas las leyes aplicables.</li>
                        <li>No utilizar el servicio para actividades fraudulentas o ilegales.</li>
                        <li>No interferir ni alterar la funcionalidad del sitio web o sus servicios.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">3. Registro de Cuenta</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Para realizar pedidos en nuestro sitio web, es posible que debas crear una cuenta. Al hacerlo, te comprometes a:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li>Proporcionar información exacta, veraz y actualizada.</li>
                        <li>Mantener la confidencialidad de tu cuenta y contraseña.</li>
                        <li>Notificarnos de inmediato en caso de cualquier uso no autorizado de tu cuenta.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">4. Pagos y Facturación</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Los pagos por los productos y servicios se realizan a través de métodos seguros como tarjetas de crédito/débito y PayPal. Los precios de los productos están sujetos a cambios sin previo aviso. Delibite se reserva el derecho de cancelar pedidos si se detectan irregularidades en el pago. Se pueden aplicar impuestos y cargos adicionales según la legislación local.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">5. Entregas y Envíos</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Zonas de cobertura: Nuestras entregas están limitadas a ciertas áreas geográficas. Tiempo de entrega: Los tiempos estimados de entrega pueden variar según disponibilidad y ubicación. Retrasos: No nos hacemos responsables por retrasos causados por terceros o situaciones fuera de nuestro control (clima, huelgas, etc.). Recepción del pedido: El usuario es responsable de estar disponible para recibir el pedido en la dirección indicada.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">6. Cancelaciones y Reembolsos</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Los pedidos pueden cancelarse antes de que el proceso de preparación haya comenzado. No se aceptarán cancelaciones una vez que el pedido esté en camino. En caso de recibir un producto en mal estado, puedes solicitar un reembolso o reemplazo contactando a nuestro servicio de atención al cliente en un plazo de 24 horas desde la entrega.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">7. Modificaciones en los Términos</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Cualquier cambio será publicado en esta página y entrará en vigencia inmediatamente después de su publicación.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">8. Propiedad Intelectual</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Todos los contenidos disponibles en Delibite (incluyendo diseño, logotipos, imágenes, textos, código fuente, etc.) están protegidos por derechos de autor y propiedad intelectual. No está permitido copiar, distribuir o modificar ningún contenido sin nuestro consentimiento expreso por escrito.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">9. Privacidad y Protección de Datos</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Recopilamos y almacenamos información personal de acuerdo con nuestra Política de Privacidad. Nos comprometemos a proteger la información del usuario y no compartirla con terceros sin consentimiento. Puedes solicitar la eliminación de tus datos personales en cualquier momento contactando a nuestro servicio de atención al cliente.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">10. Responsabilidad</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Delibite no será responsable por daños indirectos, incidentales o consecuentes derivados del uso de nuestro servicio. Pérdida de información o datos debido a fallos técnicos. Contenidos de terceros o enlaces externos incluidos en nuestro sitio web.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">11. Servicio al Cliente</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Si tienes preguntas o necesitas asistencia, puedes contactarnos a través de:
                    </p>
                    <ul className="list-disc list-inside mb-4 text-lg leading-relaxed text-justify">
                        <li>Correo electrónico: soporte@delibite.com</li>
                        <li>Teléfono: +34 900 123 456</li>
                        <li>Horario de atención: Lunes a Viernes de 9:00 a 18:00</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">12. Ley Aplicable y Jurisdicción</h2>
                    <p className="mb-4 text-lg leading-relaxed text-justify">
                        Estos términos y condiciones se rigen por las leyes locales aplicables. Cualquier disputa será resuelta ante los tribunales competentes de la jurisdicción correspondiente.
                    </p>
                </section>

                <p className="text-lg leading-relaxed text-justify">
                    Gracias por elegir Delibite. Esperamos brindarte un servicio excepcional.
                </p>
            </main>
            <Footer />
        </div>

    )
}

