import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import logo from "@/assets/handel-logo.png.asset.json";

const nav = [
  { to: "/catalogo", label: "Catálogo" },
  { to: "/equipos", label: "Equipos" },
  { to: "/marcas", label: "Marcas" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/70 shadow-sm backdrop-blur-2xl">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
        <Link to="/" aria-label="Inicio de Handel" className="flex items-center">
          <img src={logo.url} alt="Handel" className="h-7 w-auto" />
        </Link>
        <nav className="flex items-center gap-4 sm:gap-7">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/catalogo"
            aria-label="Buscar"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
