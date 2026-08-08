export default function Favorites({ favorites, onRemove, onRestore }) {
  return (
    <section id="favoritos" className="animate-rise">
      <div className="mb-8">
        <p className="section-mark font-display text-xs font-semibold tracking-[0.22em] text-saffron uppercase">
          Guardados
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Outfits favoritos
        </h2>
        <p className="mt-3 text-lg text-ink-soft italic">
          {favorites.length === 0
            ? 'Los looks que te gusten aparecerán aquí.'
            : `${favorites.length} look${favorites.length === 1 ? '' : 's'} guardados`}
        </p>
      </div>

      {favorites.length === 0 ? null : (
        <div className="space-y-5">
          {favorites.map((fav) => (
            <article
              key={fav.id}
              className="rounded-sm border border-line bg-white/40 p-4 md:p-5"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">
                  Guardado{' '}
                  {new Date(fav.savedAt || fav.createdAt).toLocaleDateString(
                    'es-CO',
                    { day: 'numeric', month: 'short' }
                  )}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onRestore(fav)}
                    className="font-display text-xs font-semibold tracking-wide text-saffron hover:underline"
                  >
                    Usar look
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(fav.id)}
                    className="font-display text-xs font-semibold tracking-wide text-clay hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[fav.superior, fav.inferior, fav.calzado].map((piece) => (
                  <div key={piece.id} className="overflow-hidden">
                    <div className="aspect-square overflow-hidden bg-mist">
                      <img
                        src={piece.imageUrl}
                        alt={piece.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                    <p className="mt-2 truncate font-display text-sm font-semibold text-ink">
                      {piece.name}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
