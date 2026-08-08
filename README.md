# Closet Matcher

Estilista digital: registra prendas y genera outfits (superior + inferior + calzado).

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Imágenes | Cloudinary (fallback local) |
| Datos | LocalStorage |

## Alcance (YAGNI)

Solo lo pedido del reto:

1. Subir prenda con categoría  
2. Galería del inventario  
3. Outfit aleatorio por categoría  
4. Persistencia básica  

Extras incluidos porque suman puntos: favoritos y filtros por color/temporada.  
Sin auth, sin DB, sin dashboard innecesario.

## Estructura

```
client/   # UI React
server/   # API de upload
```

## Arranque

```bash
npm install
npm install --prefix client
npm install --prefix server
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:4000  

Demo rápida: botón **Cargar demo rápida** (fotos en `client/public/demo`).

## Cloudinary (opcional)

```bash
cp server/.env.example server/.env
```

Sin credenciales, el upload usa data URL y la app sigue funcionando.
