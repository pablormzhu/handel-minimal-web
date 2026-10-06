import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/handel-logo.png";

const nav = [
  { to: "/", label: "Inicio" },
  { to: "/catalogo", label: "Catálogo" },
  { to: "/marcas", label: "Marcas" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
] as const;

const focus = "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/70 shadow-sm backdrop-blur-2xl">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
        <Link to="/" aria-label="Inicio de Handel" className={`flex items-center ${focus}`}>
          <img src={logo} alt="Handel" width={1119} height={947} className="h-11 w-auto" />
        </Link>
        <nav aria-label="Principal" className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-[13px] text-muted-foreground transition-colors hover:text-foreground ${focus}`}
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/catalogo"
            aria-label="Buscar"
            className={`text-muted-foreground transition-colors hover:text-foreground ${focus}`}
          >
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </Link>
        </nav>
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/catalogo" aria-label="Buscar" className={`text-muted-foreground ${focus}`}>
            <Search className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
            className={`p-1 text-foreground ${focus}`}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      <nav
        id="mobile-nav"
        aria-label="Principal móvil"
        hidden={!open}
        className="border-t border-border/40 bg-background md:hidden"
      >
        <ul className="mx-auto max-w-6xl px-6 py-2">
          {nav.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block py-3 text-base text-muted-foreground ${focus}`}
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
