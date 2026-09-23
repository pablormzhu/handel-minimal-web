import { Link } from "@tanstack/react-router";
import { families } from "@/lib/catalog";
import logo from "@/assets/handel-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-14">
        <div className="grid gap-10 border-b border-border pb-10 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] sm:gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,0.75fr)]">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" aria-label="Inicio de Handel" className="inline-block">
              <img src={logo.url} alt="Handel" className="h-9 w-auto" />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted-foreground">
              Soluciones especializadas para diagnóstico clínico, laboratorio y atención médica.
            </p>
            <Link
              to="/contacto"
              className="mt-6 inline-block text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              Hablar con un asesor
            </Link>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Catálogo</h2>
            <ul className="mt-5 grid gap-x-6 gap-y-3 text-sm leading-5 text-muted-foreground sm:grid-cols-2 lg:grid-cols-1">
              {families.map((f) => (
                <li key={f.slug}>
                  <Link
                    to="/catalogo/$familia"
                    params={{ familia: f.slug }}
                    className="transition-colors hover:text-foreground"
                  >
                    {f.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-foreground">Empresa</h2>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <Link to="/nosotros" className="transition-colors hover:text-foreground">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/marcas" className="transition-colors hover:text-foreground">
                  Marcas
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="transition-colors hover:text-foreground">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/aviso-privacidad" className="transition-colors hover:text-foreground">
                  Aviso de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Handel. Todos los derechos reservados.</p>
          <p>Ciudad de México, México</p>
        </div>
      </div>
    </footer>
  );
}
