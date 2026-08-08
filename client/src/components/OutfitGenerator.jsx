import { CATEGORY_LABEL } from '../lib/constants'

function Piece({ item, label, delay }) {
  return (
    <div
      className="garment-tile animate-outfit"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="aspect-[4/5] overflow-hidden bg-mist">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover transition duration-700 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <p className="font-display text-[0.7rem] font-semibold tracking-[0.18em] text-saffron uppercase">
          {label}
        </p>
        <h3 className="mt-1 font-display text-lg font-semibold text-ink">
          {item.name}
        </h3>
        <p className="text-sm text-ink-soft italic">
          {item.color} · {CATEGORY_LABEL[item.category]}
        </p>
      </div>
    </div>
  )
}

export default function OutfitGenerator({
  outfit,
  outfitKey,
  isFavorite,
  onGenerate,
  onToggleFavorite,
  message,
}) {
  return (
    <section id="outfit" className="animate-rise">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-mark font-display text-xs font-semibold tracking-[0.22em] text-saffron uppercase">
            Estilista
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Genera un outfit
          </h2>
          <p className="mt-3 max-w-xl text-lg text-ink-soft italic">
            Una combinación aleatoria: superior + inferior + calzado.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="btn-primary" onClick={onGenerate}>
            Generar outfit
          </button>
          {outfit && (
            <button
              type="button"
              className="btn-ghost-ink"
              onClick={onToggleFavorite}
            >
              {isFavorite ? 'Quitar de favoritos' : 'Guardar favorito'}
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className="mb-4 rounded-xl border border-clay/30 bg-white/70 px-4 py-3 text-sm font-medium text-clay">
          {message}
        </p>
      )}

      {!outfit ? (
        <div className="panel rounded-2xl px-6 py-16 text-center md:py-20">
          <p className="font-display text-3xl font-bold text-ink">
            Tu próximo look espera un clic
          </p>
          <p className="mt-3 text-ink-soft italic">
            Genera una combinación cuando tengas prendas en las tres categorías.
          </p>
        </div>
      ) : (
        <div key={outfitKey} className="grid gap-4 md:grid-cols-3 md:gap-5">
          <Piece item={outfit.superior} label="Superior" delay={0} />
          <Piece item={outfit.inferior} label="Inferior" delay={80} />
          <Piece item={outfit.calzado} label="Calzado" delay={160} />
        </div>
      )}
    </section>
  )
}
