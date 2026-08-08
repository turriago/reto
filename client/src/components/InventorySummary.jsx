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
      <div className="rounded-2xl border border-line bg-white/55 px-4 py-3">
        <p className="text-xs font-semibold tracking-wide text-sage uppercase">
          Total
        </p>
        <p className="mt-1 font-display text-3xl text-ink">{items.length}</p>
      </div>
      {counts.map((stat) => (
        <div
          key={stat.id}
          className="rounded-2xl border border-line bg-white/55 px-4 py-3"
        >
          <p className="text-xs font-semibold tracking-wide text-sage uppercase">
            {stat.label}
          </p>
          <p className="mt-1 font-display text-3xl text-ink">{stat.count}</p>
        </div>
      ))}
    </div>
  )
}
