import { CATEGORY_LABEL } from '../lib/constants'

function Piece({ item, label }) {
  return (
    <div className="animate-outfit overflow-hidden rounded-2xl border border-line bg-white/60">
      <div className="aspect-[4/5] bg-mist">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <p className="text-xs font-semibold tracking-wide text-sage uppercase">
          {label}
        </p>
        <h3 className="mt-1 font-semibold text-ink">{item.name}</h3>
        <p className="text-sm text-ink-soft">
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
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-sage uppercase">
            Estilista
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink md:text-4xl">
            Genera un outfit
          </h2>
          <p className="mt-2 max-w-xl text-ink-soft">
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
              className="btn-ghost"
              onClick={onToggleFavorite}
            >
              {isFavorite ? 'Quitar de favoritos' : 'Guardar favorito'}
            </button>
          )}
        </div>
      </div>

      {message && (
        <p className="mb-4 rounded-xl border border-clay/30 bg-white/60 px-4 py-3 text-sm font-medium text-clay">
          {message}
        </p>
      )}

      {!outfit ? (
        <div className="rounded-2xl border border-line bg-white/40 px-6 py-16 text-center">
          <p className="font-display text-2xl text-ink">
            Tu próximo look espera un clic
          </p>
          <p className="mt-2 text-ink-soft">
            Genera una combinación cuando tengas prendas en las tres categorías.
          </p>
        </div>
      ) : (
        <div
          key={outfitKey}
          className="grid gap-4 md:grid-cols-3"
        >
          <Piece item={outfit.superior} label="Superior" />
          <Piece item={outfit.inferior} label="Inferior" />
          <Piece item={outfit.calzado} label="Calzado" />
        </div>
      )}
    </section>
  )
}
