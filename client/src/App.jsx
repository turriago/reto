import { useState } from 'react'
import Favorites from './components/Favorites'
import Gallery from './components/Gallery'
import ItemForm from './components/ItemForm'
import OutfitGenerator from './components/OutfitGenerator'
import { useCloset } from './hooks/useCloset'

export default function App() {
  const {
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
  } = useCloset()

  const [filters, setFilters] = useState({
    category: 'todas',
    color: 'Todos',
    season: 'todas',
  })
  const [outfitMessage, setOutfitMessage] = useState('')

  function handleGenerate() {
    const result = generateOutfit({
      color: filters.color,
      season: filters.season,
    })
    setOutfitMessage(result.ok ? '' : result.message)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-fog/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <a href="#inicio" className="font-display text-xl tracking-tight text-ink">
            Closet Matcher
          </a>
          <nav className="hidden gap-5 text-sm font-semibold text-ink-soft md:flex">
            <a href="#agregar" className="hover:text-ink">
              Agregar
            </a>
            <a href="#galeria" className="hover:text-ink">
              Galería
            </a>
            <a href="#outfit" className="hover:text-ink">
              Outfit
            </a>
            <a href="#favoritos" className="hover:text-ink">
              Favoritos
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section
          id="inicio"
          className="relative overflow-hidden border-b border-line/60"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(95,115,88,0.18),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(196,122,90,0.14),transparent_35%)]" />
          <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-24">
            <div className="animate-rise">
              <p className="text-sm font-semibold tracking-[0.18em] text-sage uppercase">
                Tu estilista digital
              </p>
              <h1 className="mt-3 font-display text-5xl leading-[0.95] text-ink md:text-7xl">
                Closet Matcher
              </h1>
              <p className="mt-5 max-w-lg text-lg text-ink-soft">
                Registra tus prendas y desbloquea combinaciones nuevas cada
                mañana — sin reinventar el armario.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    loadDemo()
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

            <div className="animate-rise-delay-1 relative hidden min-h-72 md:block">
              <div className="absolute inset-6 rounded-[2rem] bg-sage/15" />
              <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-line bg-gradient-to-br from-white/70 to-mist/80 p-8 shadow-[0_30px_80px_rgba(26,29,26,0.08)]">
                <p className="font-display text-3xl text-ink">Look del día</p>
                <p className="mt-3 max-w-xs text-ink-soft">
                  Superior + inferior + calzado, elegidos al azar desde tu
                  inventario real.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {['Superior', 'Inferior', 'Calzado'].map((label, i) => (
                    <div
                      key={label}
                      className="aspect-[3/4] rounded-xl bg-sage/20"
                      style={{
                        animation: 'soft-pulse 3.5s ease-in-out infinite',
                        animationDelay: `${i * 0.35}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto flex max-w-6xl flex-col gap-20 px-4 py-14 md:px-6 md:py-20">
          <ItemForm onAdd={addItem} />
          <Gallery
            items={items}
            filters={filters}
            onFiltersChange={setFilters}
            onRemove={removeItem}
          />
          <OutfitGenerator
            outfit={outfit}
            outfitKey={outfitKey}
            isFavorite={isFavorite(outfit)}
            onGenerate={handleGenerate}
            onToggleFavorite={() => toggleFavorite(outfit)}
            message={outfitMessage}
          />
          <Favorites
            favorites={favorites}
            onRemove={removeFavorite}
            onRestore={(fav) => {
              restoreFavorite(fav)
              window.location.hash = 'outfit'
            }}
          />
        </div>
      </main>

      <footer className="border-t border-line/70 px-4 py-8 text-center text-sm text-ink-soft md:px-6">
        Closet Matcher · Inventario + combinaciones automáticas
      </footer>
    </div>
  )
}
