import { useState } from 'react'
import { CATEGORIES, CATEGORY_LABEL, COLORS, SEASONS } from '../lib/constants'
import InventorySummary from './InventorySummary'

function EditForm({ item, onSave, onCancel }) {
  const [draft, setDraft] = useState({
    name: item.name,
    category: item.category,
    color: item.color,
    season: item.season,
  })

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault()
        if (!draft.name.trim()) return
        onSave({
          ...draft,
          name: draft.name.trim(),
        })
      }}
    >
      <input
        className="w-full rounded-lg border border-line bg-white/80 px-2 py-1.5 text-sm"
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        aria-label="Nombre"
      />
      <select
        className="w-full rounded-lg border border-line bg-white/80 px-2 py-1.5 text-sm"
        value={draft.category}
        onChange={(e) => setDraft({ ...draft, category: e.target.value })}
        aria-label="Categoría"
      >
        {CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>
      <select
        className="w-full rounded-lg border border-line bg-white/80 px-2 py-1.5 text-sm"
        value={draft.color}
        onChange={(e) => setDraft({ ...draft, color: e.target.value })}
        aria-label="Color"
      >
        {COLORS.map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>
      <select
        className="w-full rounded-lg border border-line bg-white/80 px-2 py-1.5 text-sm"
        value={draft.season}
        onChange={(e) => setDraft({ ...draft, season: e.target.value })}
        aria-label="Temporada"
      >
        {SEASONS.map((season) => (
          <option key={season.id} value={season.id}>
            {season.label}
          </option>
        ))}
      </select>
      <div className="flex gap-2 pt-1">
        <button type="submit" className="text-xs font-semibold text-sage-deep hover:underline">
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-ink-soft hover:underline"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

export default function Gallery({
  items,
  filters,
  onFiltersChange,
  onRemove,
  onUpdate,
}) {
  const [editingId, setEditingId] = useState(null)

  const filtered = items.filter((item) => {
    if (filters.category !== 'todas' && item.category !== filters.category) {
      return false
    }
    if (filters.color !== 'Todos' && item.color !== filters.color) {
      return false
    }
    if (
      filters.season !== 'todas' &&
      item.season !== 'todas' &&
      item.season !== filters.season
    ) {
      return false
    }
    return true
  })

  return (
    <section id="galeria" className="animate-rise-delay-2">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-sage uppercase">
            Closet
          </p>
          <h2 className="mt-1 font-display text-3xl text-ink md:text-4xl">
            Tus prendas
          </h2>
          <p className="mt-2 text-ink-soft">
            {filtered.length} de {items.length} prendas visibles
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            className="rounded-xl border border-line bg-white/70 px-3 py-2 text-sm"
            value={filters.category}
            onChange={(e) =>
              onFiltersChange({ ...filters, category: e.target.value })
            }
          >
            <option value="todas">Todas las categorías</option>
            <option value="superior">Superior</option>
            <option value="inferior">Inferior</option>
            <option value="calzado">Calzado</option>
          </select>

          <select
            className="rounded-xl border border-line bg-white/70 px-3 py-2 text-sm"
            value={filters.color}
            onChange={(e) =>
              onFiltersChange({ ...filters, color: e.target.value })
            }
          >
            <option value="Todos">Todos los colores</option>
            {COLORS.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>

          <select
            className="rounded-xl border border-line bg-white/70 px-3 py-2 text-sm"
            value={filters.season}
            onChange={(e) =>
              onFiltersChange({ ...filters, season: e.target.value })
            }
          >
            {SEASONS.map((season) => (
              <option key={season.id} value={season.id}>
                {season.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <InventorySummary items={items} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white/40 px-6 py-14 text-center">
          <p className="font-display text-2xl text-ink">Closet vacío</p>
          <p className="mt-2 text-ink-soft">
            Agrega tu primera prenda para empezar a combinar.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-line/80 bg-white/55 transition duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="aspect-[4/5] overflow-hidden bg-mist">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-4">
                {editingId === item.id ? (
                  <EditForm
                    item={item}
                    onCancel={() => setEditingId(null)}
                    onSave={(updates) => {
                      onUpdate(item.id, updates)
                      setEditingId(null)
                    }}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight text-ink">
                        {item.name}
                      </h3>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(item.id)}
                          className="text-xs font-semibold text-sage-deep hover:underline"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemove(item.id)}
                          className="text-xs font-semibold text-clay hover:underline"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-ink-soft">
                      {CATEGORY_LABEL[item.category]} · {item.color}
                    </p>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
