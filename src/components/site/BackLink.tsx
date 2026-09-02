import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  to: string;
  params?: Record<string, string>;
  children: React.ReactNode;
}

export function BackLink({ to, params, children }: BackLinkProps) {
  return (
    <Link
      to={to as any}
      params={params as any}
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      {children}
    </Link>
  );
}
