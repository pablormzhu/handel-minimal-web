import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function Page({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function CtaBand({
  title = "¿Buscas una solución específica?",
  action = "Hablar con un asesor",
}: {
  title?: string;
  action?: string;
}) {
  return (
    <section className="border-t border-border/60 py-28">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">{title}</h2>
        <a
          href="/contacto"
          className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-85"
        >
          {action}
        </a>
      </div>
    </section>
  );
}
