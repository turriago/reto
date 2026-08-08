const STATS = [
  { id: 'superior', label: 'Superiores' },
  { id: 'inferior', label: 'Inferiores' },
  { id: 'calzado', label: 'Calzado' },
]

export default function InventorySummary({ items }) {
  const counts = STATS.map((stat) => ({
    ...stat,
    count: items.filter((item) => item.category === stat.id).length,
  }))

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="border-b-2 border-saffron bg-transparent px-1 py-2">
        <p className="font-display text-[0.68rem] font-semibold tracking-[0.18em] text-ink-soft uppercase">
          Total
        </p>
        <p className="mt-1 font-display text-4xl font-bold text-ink">
          {items.length}
        </p>
      </div>
      {counts.map((stat) => (
        <div key={stat.id} className="border-b border-line px-1 py-2">
          <p className="font-display text-[0.68rem] font-semibold tracking-[0.18em] text-ink-soft uppercase">
            {stat.label}
          </p>
          <p className="mt-1 font-display text-4xl font-bold text-ink">
            {stat.count}
          </p>
        </div>
      ))}
    </div>
  )
}
