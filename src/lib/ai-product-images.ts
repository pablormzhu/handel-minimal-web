// Fotos de producto generadas con IA (estilo estudio, fondo claro).
// Se agregan automáticamente: basta con guardar el archivo como
// src/assets/prod/ai/<clave>.jpg
const modules = import.meta.glob("@/assets/prod/ai/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export const AI_IMAGES: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([path, url]) => [
    path.split("/").pop()!.replace(/\.jpg$/, ""),
    url,
  ]),
);
