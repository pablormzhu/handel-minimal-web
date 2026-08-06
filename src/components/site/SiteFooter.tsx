import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-muted-foreground">
          <Link to="/catalogo" className="transition-colors hover:text-foreground">
            Catálogo
          </Link>
          <Link to="/marcas" className="transition-colors hover:text-foreground">
            Marcas
          </Link>
          <Link to="/nosotros" className="transition-colors hover:text-foreground">
            Nosotros
          </Link>
          <Link to="/contacto" className="transition-colors hover:text-foreground">
            Contacto
          </Link>
          <Link to="/aviso-privacidad" className="transition-colors hover:text-foreground">
            Aviso de privacidad
          </Link>
        </div>
        <p className="mt-8 max-w-md text-xs leading-relaxed text-muted-foreground">
          Handel · Distribución especializada en diagnóstico clínico y laboratorio.
          Ciudad de México, México.
        </p>
        <p className="mt-4 text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} Handel. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
