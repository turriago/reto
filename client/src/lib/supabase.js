import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnabled = Boolean(url && key)

export const supabase = supabaseEnabled
  ? createClient(url, key)
  : null

export function rowToItem(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    color: row.color,
    season: row.season,
    imageUrl: row.image_url,
    source: row.source || 'closet',
    brand: row.brand || undefined,
    price: row.price ?? undefined,
    store: row.store_name || undefined,
    createdAt: row.created_at,
  }
}

export function itemToRow(item) {
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    color: item.color,
    season: item.season,
    image_url: item.imageUrl,
    source: item.source || 'closet',
    brand: item.brand || null,
    price: item.price ?? null,
    store_name: item.store || null,
    created_at: item.createdAt || new Date().toISOString(),
  }
}
