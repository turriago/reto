import { useEffect, useState } from 'react'
import { DEMO_ITEMS } from '../lib/demoData'
import {
  loadFavorites,
  loadItems,
  saveFavorites,
  saveItems,
} from '../lib/storage'

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

  useEffect(() => {
    saveItems(items)
  }, [items])

  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  function addItem(item) {
    setItems((prev) => [item, ...prev])
  }

  function loadDemo() {
    setItems((prev) => {
      const demoIds = new Set(DEMO_ITEMS.map((item) => item.id))
      const custom = prev.filter((item) => !demoIds.has(item.id))
      return [...DEMO_ITEMS, ...custom]
    })
  }

  function removeItem(id) {
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

  function toggleFavorite(currentOutfit) {
    if (!currentOutfit) return

    const signature = [
      currentOutfit.superior.id,
      currentOutfit.inferior.id,
      currentOutfit.calzado.id,
    ].join('|')

    setFavorites((prev) => {
      const exists = prev.some(
        (fav) =>
          [fav.superior.id, fav.inferior.id, fav.calzado.id].join('|') ===
          signature
      )

      if (exists) {
        return prev.filter(
          (fav) =>
            [fav.superior.id, fav.inferior.id, fav.calzado.id].join('|') !==
            signature
        )
      }

      return [
        {
          ...currentOutfit,
          id: crypto.randomUUID(),
          savedAt: new Date().toISOString(),
        },
        ...prev,
      ]
    })
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

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((fav) => fav.id !== id))
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
    addItem,
    loadDemo,
    removeItem,
    generateOutfit,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    restoreFavorite,
  }
}
