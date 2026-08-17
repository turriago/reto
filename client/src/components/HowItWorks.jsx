const STEPS = [
  {
    n: '01',
    title: 'Fotografía tu ropa',
    text: 'Sube superior, inferior y calzado desde la cámara o galería.',
    href: '#agregar',
  },
  {
    n: '02',
    title: 'Genera un outfit',
    text: 'El sistema combina una prenda de cada categoría automáticamente.',
    href: '#outfit',
  },
  {
    n: '03',
    title: 'Simúlalo en ti',
    text: 'Toma tu foto (frente/lado/espalda) y ve la vista previa del look.',
    href: '#simulador',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="animate-rise">
      <div className="mb-8">
        <p className="section-mark font-display text-xs font-semibold tracking-[0.22em] text-saffron uppercase">
          Objetivo del proyecto
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          De tu clóset a una decisión visual
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft italic">
          Ayudarte a aprovechar la ropa que ya tienes: digitalizarla, combinarla
          y visualizarla antes de vestirte o comprar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map((step) => (
          <a
            key={step.n}
            href={step.href}
            className="panel block rounded-2xl p-5 transition hover:-translate-y-0.5"
          >
            <p className="font-display text-sm font-semibold tracking-[0.18em] text-saffron">
              {step.n}
            </p>
            <h3 className="mt-3 font-display text-xl font-bold text-ink">
              {step.title}
            </h3>
            <p className="mt-2 text-ink-soft italic">{step.text}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
