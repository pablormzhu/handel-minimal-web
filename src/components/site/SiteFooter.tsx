import { Link } from "@tanstack/react-router";
import { families } from "@/lib/catalog";
import logo from "@/assets/handel-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/30 bg-background/60 shadow-sm backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" aria-label="Handel inicio" className="inline-block">
              <img src={logo.url} alt="Handel" className="h-8 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted-foreground">
              Soluciones para diagnóstico, laboratorio y atención médica.
            </p>
          </div>

          <div>
            <h3 className="text-[13px] font-medium text-foreground">Catálogo</h3>
            <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground">
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
            <h3 className="text-[13px] font-medium text-foreground">Handel</h3>
            <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground">
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
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-medium text-foreground">Legal</h3>
            <ul className="mt-4 space-y-2 text-[13px] text-muted-foreground">
              <li>
                <Link to="/aviso-privacidad" className="transition-colors hover:text-foreground">
                  Aviso de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-14 text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} Handel · Ciudad de México, México. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
}
