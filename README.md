# Closet Matcher: Tu Estilista Digital

Aplicación web para registrar prendas y generar outfits automáticos (superior + inferior + calzado).

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Imágenes:** Cloudinary (con fallback a data URL si no hay credenciales)
- **Persistencia:** LocalStorage

## Funcionalidades

- Formulario para subir imagen y asignar categoría, color y temporada
- Galería de prendas con filtros
- Generador de outfit aleatorio
- Favoritos de looks guardados

## Cómo correr

```bash
# Dependencias
npm install
npm install --prefix client
npm install --prefix server

# Desarrollo (API + frontend)
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:4000

### Cloudinary (opcional)

Copia `server/.env.example` a `server/.env` y completa:

```
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Sin `.env`, las imágenes se guardan como data URL para que la demo funcione igual.
