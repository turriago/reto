import { useEffect, useState } from 'react'
import { DEMO_ITEMS } from '../lib/demoData'
import {
  loadFavorites,
  loadItems,
  saveFavorites,
  saveItems,
} from '../lib/storage'
import {
  itemToRow,
  rowToItem,
  supabase,
  supabaseEnabled,
} from '../lib/supabase'

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function outfitSignature(outfit) {
  if (!outfit) return ''
  return [outfit.superior.id, outfit.inferior.id, outfit.calzado.id].join('|')
}

function pickRandomOutfit(tops, bottoms, shoes, previousSignature) {
  const maxAttempts = 12
  let next = null

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    next = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      superior: pickRandom(tops),
      inferior: pickRandom(bottoms),
      calzado: pickRandom(shoes),
    }

    if (outfitSignature(next) !== previousSignature) {
      return next
    }
  }

  return next
}

export function useCloset() {
  const [items, setItems] = useState(() => loadItems())
  const [favorites, setFavorites] = useState(() => loadFavorites())
  const [outfit, setOutfit] = useState(null)
  const [outfitKey, setOutfitKey] = useState(0)
  const [syncing, setSyncing] = useState(false)
  const [cloudReady, setCloudReady] = useState(false)

  useEffect(() => {
    saveItems(items)
  }, [items])

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  useEffect(() => {
    if (!supabaseEnabled) return undefined

    let cancelled = false

    async function hydrate() {
      setSyncing(true)
      try {
        const [{ data: garmentRows, error: garmentError }, { data: favRows, error: favError }] =
          await Promise.all([
            supabase
              .from('garments')
              .select('*')
              .order('created_at', { ascending: false }),
            supabase
              .from('favorite_outfits')
              .select('*')
              .order('saved_at', { ascending: false }),
          ])

        if (garmentError) throw garmentError
        if (favError) throw favError
        if (cancelled) return

        if (garmentRows?.length) {
          setItems(garmentRows.map(rowToItem))
        }
        if (favRows?.length) {
          setFavorites(favRows.map((row) => row.payload))
        }
        setCloudReady(true)
      } catch (error) {
        console.warn('Supabase hydrate failed, using local data:', error.message)
        setCloudReady(false)
      } finally {
        if (!cancelled) setSyncing(false)
      }
    }

    hydrate()
    return () => {
      cancelled = true
    }
  }, [])

  async function addItem(item) {
    setItems((prev) => [item, ...prev])
    if (!supabaseEnabled) return
    const { error } = await supabase.from('garments').upsert(itemToRow(item))
    if (error) console.warn('Supabase addItem:', error.message)
  }

  async function updateItem(id, updates) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )

    const patchPiece = (piece) =>
      piece.id === id ? { ...piece, ...updates } : piece

    setFavorites((prev) =>
      prev.map((fav) => ({
        ...fav,
        superior: patchPiece(fav.superior),
        inferior: patchPiece(fav.inferior),
        calzado: patchPiece(fav.calzado),
      }))
    )

    setOutfit((current) => {
      if (!current) return current
      return {
        ...current,
        superior: patchPiece(current.superior),
        inferior: patchPiece(current.inferior),
        calzado: patchPiece(current.calzado),
      }
    })

    if (!supabaseEnabled) return
    const current = items.find((item) => item.id === id)
    const merged = { ...(current || { id }), ...updates, id }
    const { error } = await supabase.from('garments').upsert(itemToRow(merged))
    if (error) console.warn('Supabase updateItem:', error.message)
  }

  async function loadDemo() {
    setItems((prev) => {
      const demoIds = new Set(DEMO_ITEMS.map((item) => item.id))
      const custom = prev.filter((item) => !demoIds.has(item.id))
      return [...DEMO_ITEMS, ...custom]
    })

    if (!supabaseEnabled) return
    const { error } = await supabase.from('garments').upsert(DEMO_ITEMS.map(itemToRow))
    if (error) console.warn('Supabase loadDemo:', error.message)
  }

  async function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setFavorites((prev) =>
      prev.filter(
        (fav) =>
          fav.superior.id !== id &&
          fav.inferior.id !== id &&
          fav.calzado.id !== id
      )
    )
    setOutfit((current) => {
      if (!current) return current
      if (
        current.superior.id === id ||
        current.inferior.id === id ||
        current.calzado.id === id
      ) {
        return null
      }
      return current
    })

    if (!supabaseEnabled) return
    const { error } = await supabase.from('garments').delete().eq('id', id)
    if (error) console.warn('Supabase removeItem:', error.message)
  }

  function generateOutfit(filters = {}) {
    const byCategory = (category) =>
      items.filter((item) => {
        if (item.category !== category) return false
        if (filters.color && filters.color !== 'Todos' && item.color !== filters.color) {
          return false
        }
        if (
          filters.season &&
          filters.season !== 'todas' &&
          item.season !== 'todas' &&
          item.season !== filters.season
        ) {
          return false
        }
        return true
      })

    const tops = byCategory('superior')
    const bottoms = byCategory('inferior')
    const shoes = byCategory('calzado')

    if (!tops.length || !bottoms.length || !shoes.length) {
      return {
        ok: false,
        message:
          'Necesitas al menos una prenda en cada categoría (superior, inferior y calzado) para generar un outfit.',
      }
    }

    const next = pickRandomOutfit(
      tops,
      bottoms,
      shoes,
      outfitSignature(outfit)
    )

    setOutfit(next)
    setOutfitKey((k) => k + 1)
    return { ok: true, outfit: next }
  }

  async function toggleFavorite(currentOutfit) {
    if (!currentOutfit) return

    const signature = [
      currentOutfit.superior.id,
      currentOutfit.inferior.id,
      currentOutfit.calzado.id,
    ].join('|')

    const existing = favorites.find(
      (fav) =>
        [fav.superior.id, fav.inferior.id, fav.calzado.id].join('|') ===
        signature
    )

    if (existing) {
      setFavorites((prev) => prev.filter((fav) => fav.id !== existing.id))
      if (supabaseEnabled) {
        const { error } = await supabase
          .from('favorite_outfits')
          .delete()
          .eq('id', existing.id)
        if (error) console.warn('Supabase remove favorite:', error.message)
      }
      return
    }

    const saved = {
      ...currentOutfit,
      id: crypto.randomUUID(),
      savedAt: new Date().toISOString(),
    }
    setFavorites((prev) => [saved, ...prev])

    if (supabaseEnabled) {
      const { error } = await supabase.from('favorite_outfits').upsert({
        id: saved.id,
        payload: saved,
        saved_at: saved.savedAt,
      })
      if (error) console.warn('Supabase add favorite:', error.message)
    }
  }

  function isFavorite(currentOutfit) {
    if (!currentOutfit) return false
    const signature = [
      currentOutfit.superior.id,
      currentOutfit.inferior.id,
      currentOutfit.calzado.id,
    ].join('|')

    return favorites.some(
      (fav) =>
        [fav.superior.id, fav.inferior.id, fav.calzado.id].join('|') ===
        signature
    )
  }

  async function removeFavorite(id) {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
    if (!supabaseEnabled) return
    const { error } = await supabase.from('favorite_outfits').delete().eq('id', id)
    if (error) console.warn('Supabase removeFavorite:', error.message)
  }

  function restoreFavorite(favorite) {
    if (!favorite) return
    setOutfit({
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      superior: favorite.superior,
      inferior: favorite.inferior,
      calzado: favorite.calzado,
    })
    setOutfitKey((k) => k + 1)
  }

  return {
    items,
    favorites,
    outfit,
    outfitKey,
    syncing,
    cloudReady,
    supabaseEnabled,
    addItem,
    updateItem,
    loadDemo,
    removeItem,
    generateOutfit,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    restoreFavorite,
  }
}
