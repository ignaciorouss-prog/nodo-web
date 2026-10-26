# NODO — Diseño que conecta

Sitio de NODO: identidad visual, diseño web y contenido.

Sitio publicado: https://nodo-identidad-en-movimiento.brainy-cabin-5330.chatgpt.site/

## Ejecutar localmente

Requiere Python 3. Desde la carpeta del repositorio:

```sh
python -m http.server 8080 --directory dist
```

Abrir http://localhost:8080. No requiere instalar dependencias ni un proceso de compilación.

## Estructura

- `dist/`: página lista para publicar, estilos, scripts y recursos.
- `dist/assets/`: logos vectoriales, imágenes y Three.js con su licencia.
- `demo-template.html`, `build-demo.py`: plantilla y generador de la demo autocontenida de MISS U.
- `.openai/hosting.json`: configuración de la publicación actual en Sites.

## Actualizar la demo

Editar `demo-template.html`, `dist/missu-demo.css` o `dist/missu-demo.js` y ejecutar:

```sh
python build-demo.py
```

Las demos usan datos ficticios en memoria. No realizan compras ni cambian el sistema real de MISS U.

## Contacto y preferencias

El formulario abre WhatsApp con un mensaje preparado. El visitante decide enviarlo. El modo día/noche se guarda localmente en el navegador.

## Publicación

Para un alojamiento estático, servir el contenido de `dist/`. Subir cambios a este repositorio no actualiza automáticamente el sitio de Sites: su publicación se gestiona por separado.
