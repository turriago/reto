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
    created_at: item.createdAt || new Date().toISOString(),
  }
}
