import { useEffect, useRef, useState } from 'react'

const ANGLES = [
  { id: 'frente', label: 'Frente' },
  { id: 'lado', label: 'Lado' },
  { id: 'espalda', label: 'Espalda' },
]

const STEPS = [
  'Leyendo ángulos…',
  'Reconstruyendo silueta…',
  'Probando el outfit…',
  'Renderizando look…',
]

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No se pudo leer la foto'))
    reader.readAsDataURL(file)
  })
}

export default function LookSimulator({ outfit, onNeedOutfit }) {
  const [photos, setPhotos] = useState({
    frente: '',
    lado: '',
    espalda: '',
  })
  const [activeAngle, setActiveAngle] = useState('frente')
  const [status, setStatus] = useState('idle')
  const [stepLabel, setStepLabel] = useState('')
  const [resultReady, setResultReady] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const hasPhoto = Boolean(photos.frente || photos.lado || photos.espalda)
  const mainPhoto =
    photos[activeAngle] || photos.frente || photos.lado || photos.espalda

  async function handlePhoto(angleId, file) {
    if (!file) return
    const url = await readFile(file)
    setPhotos((prev) => ({ ...prev, [angleId]: url }))
    setActiveAngle(angleId)
    setResultReady(false)
  }

  function runSimulation() {
    if (!hasPhoto) return
    if (!outfit) {
      onNeedOutfit?.()
      return
    }

    timers.current.forEach(clearTimeout)
    timers.current = []
    setStatus('processing')
    setResultReady(false)

    STEPS.forEach((label, index) => {
      const timer = setTimeout(() => setStepLabel(label), index * 700)
      timers.current.push(timer)
    })

    const done = setTimeout(() => {
      setStatus('done')
      setResultReady(true)
      setStepLabel('Simulación lista')
    }, STEPS.length * 700 + 200)
    timers.current.push(done)
  }

  return (
    <section id="simulador" className="animate-rise">
      <div className="mb-8">
        <p className="section-mark font-display text-xs font-semibold tracking-[0.22em] text-saffron uppercase">
          Simulación IA
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Pruébate el look
        </h2>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft italic">
          Sube o toma fotos en varios ángulos y genera una vista previa del
          outfit sobre tu silueta.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {ANGLES.map((angle) => (
              <label
                key={angle.id}
                className={`relative flex min-h-36 cursor-pointer flex-col overflow-hidden rounded-sm border ${
                  photos[angle.id] ? 'border-saffron' : 'border-dashed border-line'
                } bg-white/40`}
              >
                {photos[angle.id] ? (
                  <img
                    src={photos[angle.id]}
                    alt={`Foto ${angle.label}`}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center px-3 py-6 text-center">
                    <p className="font-display text-sm font-semibold text-ink">
                      {angle.label}
                    </p>
                    <p className="mt-1 text-xs text-ink-soft italic">
                      Subir o cámara
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="sr-only"
                  onChange={(e) => handlePhoto(angle.id, e.target.files?.[0])}
                />
              </label>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary"
              disabled={!hasPhoto || status === 'processing'}
              onClick={runSimulation}
            >
              {status === 'processing' ? 'Procesando…' : 'Generar simulación IA'}
            </button>
            {!outfit && (
              <button type="button" className="btn-ghost-ink" onClick={onNeedOutfit}>
                Primero genera un outfit
              </button>
            )}
          </div>

          {status === 'processing' && (
            <p className="font-display text-sm font-semibold tracking-wide text-saffron">
              {stepLabel}
            </p>
          )}
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-sm border border-line bg-ink">
          {!mainPhoto ? (
            <div className="flex h-full min-h-[420px] items-center justify-center px-6 text-center">
              <p className="max-w-xs font-display text-xl text-porcelain/80">
                Aquí aparecerá tu simulación
              </p>
            </div>
          ) : (
            <>
              <img
                src={mainPhoto}
                alt="Simulación de persona"
                className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
                  resultReady ? 'scale-105 opacity-70' : 'opacity-90'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent" />

              {status === 'processing' && <div className="ai-scan" />}

              {resultReady && outfit && (
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-display text-xs font-semibold tracking-[0.2em] text-saffron uppercase">
                      Vista previa del look
                    </p>
                    <div className="flex gap-1">
                      {ANGLES.filter((angle) => photos[angle.id]).map((angle) => (
                        <button
                          key={angle.id}
                          type="button"
                          onClick={() => setActiveAngle(angle.id)}
                          className={`px-2 py-1 font-display text-[0.65rem] font-semibold tracking-wide uppercase ${
                            activeAngle === angle.id
                              ? 'bg-saffron text-ink'
                              : 'bg-porcelain/15 text-porcelain'
                          }`}
                        >
                          {angle.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[outfit.superior, outfit.inferior, outfit.calzado].map(
                      (piece, index) => (
                        <div
                          key={piece.id}
                          className="animate-outfit overflow-hidden border border-porcelain/25 bg-ink/55 backdrop-blur-sm"
                          style={{ animationDelay: `${index * 90}ms` }}
                        >
                          <div className="aspect-[3/4]">
                            <img
                              src={piece.imageUrl}
                              alt={piece.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <p className="truncate px-2 py-1.5 font-display text-[0.7rem] text-porcelain">
                            {piece.name}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {status === 'done' && (
                <p className="absolute top-4 left-4 z-10 border border-saffron/50 bg-ink/70 px-3 py-1 font-display text-[0.65rem] font-semibold tracking-[0.18em] text-saffron uppercase">
                  Simulación lista
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
