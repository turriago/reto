import { CATEGORY_LABEL } from '../lib/constants'
import { DEMO_STORE_NAME, formatCop } from '../lib/demoData'

export default function StoreCloset({ items, onTryPiece, highlightedId }) {
  return (
    <section id="tienda" className="animate-rise">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-mark font-display text-xs font-semibold tracking-[0.22em] text-saffron uppercase">
            Closet de tienda
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            {DEMO_STORE_NAME}
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft italic">
            Catálogo demo: prueba una prenda de la tienda con lo que ya tienes
            en tu closet y simúlala en tu cuerpo.
          </p>
        </div>
        <p className="font-display text-sm font-semibold tracking-wide text-ink-soft">
          {items.length} prendas en vitrina
        </p>
      </div>

      {items.length === 0 ? (
        <div className="panel rounded-2xl px-6 py-16 text-center">
          <p className="font-display text-3xl font-bold text-ink">Tienda vacía</p>
          <p className="mt-3 text-ink-soft italic">
            Pulsa “Cargar demo rápida” en el inicio para ver el catálogo.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => {
            const active = highlightedId === item.id
            return (
              <article
                key={item.id}
                className={`garment-tile group relative ${
                  active ? 'ring-2 ring-saffron ring-offset-2 ring-offset-fog' : ''
                }`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="absolute top-3 left-3 z-10 rounded-md bg-ink/80 px-2 py-1 font-display text-[0.65rem] font-semibold tracking-[0.14em] text-porcelain uppercase backdrop-blur-sm">
                  Tienda
                </div>
                <div className="aspect-[4/5] overflow-hidden bg-mist">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3 p-4">
                  <div>
                    <p className="font-display text-[0.65rem] font-semibold tracking-[0.16em] text-saffron uppercase">
                      {item.brand}
                    </p>
                    <h3 className="mt-1 font-display font-semibold leading-tight text-ink">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-ink-soft italic">
                      {CATEGORY_LABEL[item.category]} · {item.color}
                    </p>
                    <p className="mt-2 font-display text-sm font-semibold text-ink">
                      {formatCop(item.price)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-ghost-ink w-full"
                    onClick={() => onTryPiece(item)}
                  >
                    {active ? 'En tu simulación' : 'Probar en mi look'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
