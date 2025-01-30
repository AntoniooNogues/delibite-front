import "../app/globals.css"
export default function NavbarReducido() {
    return (
        <header>
            <nav className={"flex flex-1 space-x-2"}>
                <div>
                    <span className={"bg-grisFondo"}>
                        delibite
                    </span>
                </div>
                <div>
                    <ul className="flex flex-row list-none space-x-4">
                        <li>Suscripción</li>
                        <li>Catálogo</li>
                        <li>Packs</li>
                    </ul>
                </div>

            </nav>
        </header>
    );
}