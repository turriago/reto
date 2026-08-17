/**
 * Seed Closet Matcher demo garments into Supabase.
 *
 * Usage:
 *   set SUPABASE_URL=https://xxxx.supabase.co
 *   set SUPABASE_ANON_KEY=...
 *   node scripts/seed-demo.mjs
 *
 * Prerequisites: run supabase/schema.sql in the SQL editor first.
 */
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const demoDir = path.join(root, 'client', 'public', 'demo')

const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL and SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(url, key)

const DEMO_STORE_NAME = 'Atelier Norte'

const CATALOG = [
  {
    id: 'demo-top-1',
    name: 'Camisa blanca',
    category: 'superior',
    color: 'Blanco',
    season: 'todas',
    source: 'closet',
    file: 'superior-1.jpg',
  },
  {
    id: 'demo-top-2',
    name: 'Suéter beige',
    category: 'superior',
    color: 'Beige',
    season: 'invierno',
    source: 'closet',
    file: 'superior-2.jpg',
  },
  {
    id: 'demo-bottom-1',
    name: 'Jeans azul',
    category: 'inferior',
    color: 'Azul',
    season: 'todas',
    source: 'closet',
    file: 'inferior-1.jpg',
  },
  {
    id: 'demo-bottom-2',
    name: 'Pantalón negro',
    category: 'inferior',
    color: 'Negro',
    season: 'todas',
    source: 'closet',
    file: 'inferior-2.jpg',
  },
  {
    id: 'demo-shoe-1',
    name: 'Zapatillas blancas',
    category: 'calzado',
    color: 'Blanco',
    season: 'todas',
    source: 'closet',
    file: 'calzado-1.jpg',
  },
  {
    id: 'demo-shoe-2',
    name: 'Botas café',
    category: 'calzado',
    color: 'Café',
    season: 'invierno',
    source: 'closet',
    file: 'calzado-2.jpg',
  },
  {
    id: 'store-top-1',
    name: 'Blazer lino arena',
    category: 'superior',
    color: 'Beige',
    season: 'verano',
    source: 'store',
    brand: 'Norte Studio',
    price: 189000,
    store_name: DEMO_STORE_NAME,
    file: 'store-superior-1.jpg',
  },
  {
    id: 'store-top-2',
    name: 'Camisa oxford crisp',
    category: 'superior',
    color: 'Blanco',
    season: 'todas',
    source: 'store',
    brand: 'Norte Studio',
    price: 129000,
    store_name: DEMO_STORE_NAME,
    file: 'store-superior-2.jpg',
  },
  {
    id: 'store-bottom-1',
    name: 'Wide jeans indigo',
    category: 'inferior',
    color: 'Azul',
    season: 'todas',
    source: 'store',
    brand: 'Calle 7',
    price: 159000,
    store_name: DEMO_STORE_NAME,
    file: 'store-inferior-1.jpg',
  },
  {
    id: 'store-bottom-2',
    name: 'Trouser negro slim',
    category: 'inferior',
    color: 'Negro',
    season: 'todas',
    source: 'store',
    brand: 'Calle 7',
    price: 149000,
    store_name: DEMO_STORE_NAME,
    file: 'store-inferior-2.jpg',
  },
  {
    id: 'store-shoe-1',
    name: 'Sneaker city white',
    category: 'calzado',
    color: 'Blanco',
    season: 'todas',
    source: 'store',
    brand: 'Paso Urbano',
    price: 219000,
    store_name: DEMO_STORE_NAME,
    file: 'store-calzado-1.jpg',
  },
  {
    id: 'store-shoe-2',
    name: 'Boot chelsea café',
    category: 'calzado',
    color: 'Café',
    season: 'invierno',
    source: 'store',
    brand: 'Paso Urbano',
    price: 279000,
    store_name: DEMO_STORE_NAME,
    file: 'store-calzado-2.jpg',
  },
]

async function uploadImage(fileName) {
  const filePath = path.join(demoDir, fileName)
  const bytes = fs.readFileSync(filePath)
  const storagePath = `demo/${fileName}`

  const { error } = await supabase.storage
    .from('garments')
    .upload(storagePath, bytes, {
      contentType: 'image/jpeg',
      upsert: true,
    })

  if (error) throw new Error(`Upload ${fileName}: ${error.message}`)

  const { data } = supabase.storage.from('garments').getPublicUrl(storagePath)
  return data.publicUrl
}

async function main() {
  console.log('Seeding', url)

  const rows = []
  for (const item of CATALOG) {
    const imageUrl = await uploadImage(item.file)
    console.log('↑', item.file, '→', imageUrl)
    rows.push({
      id: item.id,
      name: item.name,
      category: item.category,
      color: item.color,
      season: item.season,
      image_url: imageUrl,
      source: item.source,
      brand: item.brand || null,
      price: item.price ?? null,
      store_name: item.store_name || null,
      created_at: new Date().toISOString(),
    })
  }

  const { error } = await supabase.from('garments').upsert(rows)
  if (error) throw new Error(`Upsert garments: ${error.message}`)

  console.log(`OK: ${rows.length} prendas en garments (closet + tienda)`)
}

main().catch((error) => {
  console.error(error.message || error)
  process.exit(1)
})
