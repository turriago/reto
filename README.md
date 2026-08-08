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

## Deploy en Netlify

La UI se publica como sitio estático. El upload funciona sin el servidor Express (data URL local).

1. Entra a [app.netlify.com](https://app.netlify.com)
2. **Add new site → Import an existing project → GitHub**
3. Elige `Cooweb-co/turriago-battletechcaribe1`
4. Netlify detecta `netlify.toml`:
   - Build command: `npm install --prefix client && npm run build --prefix client`
   - Publish directory: `client/dist`
5. Deploy

También puedes arrastrar la carpeta `client/dist` tras correr `npm run build`.
