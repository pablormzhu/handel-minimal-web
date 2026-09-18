# Fotografías individuales para SIN MARCA y LAROCHELLE

## Alcance
- Extraer del catálogo los 39 productos de `SIN MARCA` y los 18 de `LAROCHELLE`.
- Crear una fotografía de estudio distinta por SKU, usando nombre, descripción y características para reflejar tipo, material, color, medida y presentación.
- Sustituir las 18 imágenes actuales de LAROCHELLE y añadir las 39 faltantes de SIN MARCA, sin cambiar catálogo, textos, orden ni diseño.

## Dirección visual
- Imagen cuadrada, producto completo y centrado, fondo gris-blanco claro, luz difusa y sombra de contacto sutil.
- Escala y márgenes coherentes con las tandas existentes.
- Sin personas, decorados, marcas inventadas ni texto técnico falso.
- Diferenciar explícitamente bolsas RPBI, aplicadores, asas, cortaúñas, espátulas, recipientes, soluciones y consumibles según cada ficha.

## Verificación
- Confirmar cobertura exacta 39/39 y 18/18 mediante el resolvedor automático por SKU.
- Comprobar dimensiones, archivos válidos, hashes y ausencia de imágenes idénticas accidentales.
- Revisar visualmente ambas páginas en escritorio y móvil, incluyendo que no existan imágenes rotas o genéricas.
- Mantener intactos el homepage, las seis portadas de categorías y todas las demás marcas.

## Detalles técnicos
- Guardar cada resultado como `src/assets/prod/ai/<SKU>.jpg`; sólo añadir mapeo si una clave no puede representarse como nombre de archivo.
- Documentar el lote con inventario, prompts y manifiesto de hashes para conservar el mismo flujo de las tandas anteriores.
