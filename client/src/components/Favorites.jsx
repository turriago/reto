export default function Favorites({ favorites, onRemove, onRestore }) {
  return (
    <section id="favoritos" className="animate-rise">
      <div className="mb-6">
        <p className="text-sm font-semibold tracking-wide text-sage uppercase">
          Guardados
        </p>
        <h2 className="mt-1 font-display text-3xl text-ink md:text-4xl">
          Outfits favoritos
        </h2>
        <p className="mt-2 text-ink-soft">
          {favorites.length === 0
            ? 'Los looks que te gusten aparecerán aquí.'
            : `${favorites.length} look${favorites.length === 1 ? '' : 's'} guardados`}
        </p>
      </div>

      {favorites.length === 0 ? null : (
        <div className="space-y-4">
          {favorites.map((fav) => (
            <article
              key={fav.id}
              className="rounded-2xl border border-line bg-white/50 p-4"
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-semibold text-ink-soft">
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
                    className="text-xs font-semibold text-sage-deep hover:underline"
                  >
                    Usar look
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(fav.id)}
                    className="text-xs font-semibold text-clay hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[fav.superior, fav.inferior, fav.calzado].map((piece) => (
                  <div key={piece.id} className="overflow-hidden rounded-xl">
                    <div className="aspect-square bg-mist">
                      <img
                        src={piece.imageUrl}
                        alt={piece.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="mt-2 truncate text-sm font-medium text-ink">
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
