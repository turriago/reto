import { useEffect, useState } from 'react'
import Favorites from './components/Favorites'
import Gallery from './components/Gallery'
import ItemForm from './components/ItemForm'
import LookSimulator from './components/LookSimulator'
import OutfitGenerator from './components/OutfitGenerator'
import Toast from './components/Toast'
import { useCloset } from './hooks/useCloset'

export default function App() {
  const {
    items,
    favorites,
    outfit,
    outfitKey,
    addItem,
    updateItem,
    loadDemo,
    removeItem,
    generateOutfit,
    toggleFavorite,
    isFavorite,
    removeFavorite,
    restoreFavorite,
  } = useCloset()

  const [filters, setFilters] = useState({
    category: 'todas',
    color: 'Todos',
    season: 'todas',
  })
  const [outfitMessage, setOutfitMessage] = useState('')
  const [toast, setToast] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.7)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleGenerate() {
    const result = generateOutfit({
      color: filters.color,
      season: filters.season,
    })
    setOutfitMessage(result.ok ? '' : result.message)
    if (result.ok) setToast('Nuevo outfit listo')
  }

  function handleToggleFavorite() {
    if (!outfit) return
    const wasFavorite = isFavorite(outfit)
    toggleFavorite(outfit)
    setToast(wasFavorite ? 'Quitado de favoritos' : 'Outfit guardado en favoritos')
  }

  return (
    <div className="min-h-screen">
      <header className={`site-header ${scrolled ? '' : 'is-hero'}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
          <a
            href="#inicio"
            className="font-display text-lg font-bold tracking-tight md:text-xl"
          >
            Closet Matcher
          </a>
          <nav className="hidden gap-6 font-display text-sm font-semibold tracking-wide md:flex">
            <a href="#agregar" className="opacity-85 hover:opacity-100">
              Agregar
            </a>
            <a href="#galeria" className="opacity-85 hover:opacity-100">
              Galería
            </a>
            <a href="#outfit" className="opacity-85 hover:opacity-100">
              Outfit
            </a>
            <a href="#simulador" className="opacity-85 hover:opacity-100">
              Simulación
            </a>
            <a href="#favoritos" className="opacity-85 hover:opacity-100">
              Favoritos
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="inicio"
          className="relative flex min-h-[100svh] items-end overflow-hidden"
        >
          <img
            src="/demo/superior-1.jpg"
            alt=""
            className="hero-media absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_85%,rgba(200,150,62,0.28),transparent_40%)]" />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-14 pt-28 md:px-6 md:pb-20">
            <div className="animate-rise max-w-xl">
              <p className="font-display text-xs font-semibold tracking-[0.28em] text-saffron uppercase">
                Atelier digital
              </p>
              <h1 className="mt-4 font-display text-[clamp(3.2rem,9vw,6.2rem)] leading-[0.92] font-extrabold tracking-tight text-porcelain">
                Closet Matcher
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-porcelain/90 italic md:text-xl">
                Combina lo que ya tienes. Cada mañana, un look nuevo sin
                comprar de más.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-hero"
                  onClick={() => {
                    loadDemo()
                    setToast('Demo cargada: 6 prendas listas')
                    window.location.hash = 'outfit'
                  }}
                >
                  Cargar demo rápida
                </button>
                <a href="#agregar" className="btn-ghost">
                  Agregar prenda
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-14 md:gap-20 md:px-6 md:py-20">
          <ItemForm
            onAdd={(item) => {
              addItem(item)
              setToast(`“${item.name}” agregada al closet`)
            }}
          />
          <Gallery
            items={items}
            filters={filters}
            onFiltersChange={setFilters}
            onRemove={(id) => {
              removeItem(id)
              setToast('Prenda eliminada')
            }}
            onUpdate={(id, updates) => {
              updateItem(id, updates)
              setToast('Prenda actualizada')
            }}
          />
          <OutfitGenerator
            outfit={outfit}
            outfitKey={outfitKey}
            isFavorite={isFavorite(outfit)}
            onGenerate={handleGenerate}
            onToggleFavorite={handleToggleFavorite}
            message={outfitMessage}
          />
          <LookSimulator
            outfit={outfit}
            onNeedOutfit={() => {
              handleGenerate()
              setToast('Genera o usa un outfit para simularlo')
              window.location.hash = 'outfit'
            }}
          />
          <Favorites
            favorites={favorites}
            onRemove={(id) => {
              removeFavorite(id)
              setToast('Favorito eliminado')
            }}
            onRestore={(fav) => {
              restoreFavorite(fav)
              setToast('Look restaurado en el generador')
              window.location.hash = 'outfit'
            }}
          />
        </div>
      </main>

      <footer className="border-t border-line px-4 py-10 text-center md:px-6">
        <p className="font-display text-sm font-semibold tracking-[0.18em] text-ink uppercase">
          Closet Matcher
        </p>
        <p className="mt-2 text-ink-soft italic">
          Inventario + combinaciones con estilo de atelier
        </p>
      </footer>

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  )
}
