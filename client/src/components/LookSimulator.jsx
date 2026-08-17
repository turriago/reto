import { useEffect, useRef, useState } from 'react'
import { composeTryOn } from '../lib/composeTryOn'

const ANGLES = [
  { id: 'frente', label: 'Frente', demo: '/demo/persona-frente.jpg' },
  { id: 'lado', label: 'Lado', demo: '/demo/persona-lado.jpg' },
  { id: 'espalda', label: 'Espalda', demo: '/demo/persona-espalda.jpg' },
]

const STEPS = [
  'Analizando tu foto…',
  'Ajustando prendas a tu silueta…',
  'Combinando tu outfit…',
  'Generando vista previa…',
]

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No se pudo leer la foto'))
    reader.readAsDataURL(file)
  })
}

export default function LookSimulator({ outfit, onNeedOutfit, onToast }) {
  const [photos, setPhotos] = useState({
    frente: '',
    lado: '',
    espalda: '',
  })
  const [activeAngle, setActiveAngle] = useState('frente')
  const [status, setStatus] = useState('idle')
  const [stepLabel, setStepLabel] = useState('')
  const [resultReady, setResultReady] = useState(false)
  const [resultImage, setResultImage] = useState('')
  const [error, setError] = useState('')
  const timers = useRef([])

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const hasPhoto = Boolean(photos.frente || photos.lado || photos.espalda)
  const mainPhoto =
    photos[activeAngle] || photos.frente || photos.lado || photos.espalda
  const photoCount = ANGLES.filter((angle) => photos[angle.id]).length

  async function handlePhoto(angleId, file) {
    if (!file) return
    const url = await readFile(file)
    setPhotos((prev) => ({ ...prev, [angleId]: url }))
    setActiveAngle(angleId)
    setResultReady(false)
    setResultImage('')
    setError('')
  }

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  async function runSimulation() {
    setError('')

    if (!hasPhoto) {
      setError('Toma o sube al menos tu foto de frente.')
      onToast?.('Falta tu foto para simular')
      return
    }

    if (!outfit) {
      setError('Primero genera un outfit con tus prendas.')
      onNeedOutfit?.()
      return
    }

    clearTimers()
    setStatus('processing')
    setResultReady(false)
    setResultImage('')

    STEPS.forEach((label, index) => {
      const timer = setTimeout(() => setStepLabel(label), index * 650)
      timers.current.push(timer)
    })

    try {
      const composed = await composeTryOn({
        personUrl: mainPhoto,
        superiorUrl: outfit.superior.imageUrl,
        inferiorUrl: outfit.inferior.imageUrl,
        calzadoUrl: outfit.calzado.imageUrl,
      })

      const finish = setTimeout(() => {
        setResultImage(composed)
        setStatus('done')
        setResultReady(true)
        setStepLabel('Simulación lista')
        onToast?.('Simulación lista con tus fotos')
      }, STEPS.length * 650)
      timers.current.push(finish)
    } catch (err) {
      clearTimers()
      setStatus('idle')
      setError(err.message || 'No se pudo generar la simulación')
      onToast?.('Error al generar la simulación')
    }
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
          Usa tus fotos (frente, lado, espalda) y el outfit de tus prendas para
          ver una vista previa del look.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2 text-sm">
        <span
          className={`rounded-md px-3 py-1 font-display text-xs font-semibold tracking-wide uppercase ${
            photoCount > 0 ? 'bg-saffron/20 text-ink' : 'bg-white/60 text-ink-soft'
          }`}
        >
          1. Tus fotos {photoCount}/3
        </span>
        <span
          className={`rounded-md px-3 py-1 font-display text-xs font-semibold tracking-wide uppercase ${
            outfit ? 'bg-saffron/20 text-ink' : 'bg-white/60 text-ink-soft'
          }`}
        >
          2. Outfit {outfit ? 'listo' : 'pendiente'}
        </span>
        <span
          className={`rounded-md px-3 py-1 font-display text-xs font-semibold tracking-wide uppercase ${
            resultReady ? 'bg-saffron/20 text-ink' : 'bg-white/60 text-ink-soft'
          }`}
        >
          3. Resultado {resultReady ? 'listo' : 'pendiente'}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="panel space-y-5 rounded-2xl p-4 md:p-5">
          <p className="font-display text-sm font-semibold text-ink">
            Paso A — Fotos de la persona
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {ANGLES.map((angle) => (
              <label
                key={angle.id}
                className={`relative flex min-h-44 cursor-pointer flex-col overflow-hidden rounded-xl border ${
                  photos[angle.id] ? 'border-saffron' : 'border-dashed border-line'
                } bg-white/60 transition hover:border-saffron/70`}
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
                      Cámara o galería
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

          <div className="rounded-xl border border-line bg-white/50 px-3 py-3 text-sm text-ink-soft">
            <p className="font-display text-xs font-semibold tracking-wide text-ink uppercase">
              Paso B — Outfit
            </p>
            <p className="mt-1 italic">
              {outfit
                ? `Listo: ${outfit.superior.name} + ${outfit.inferior.name} + ${outfit.calzado.name}`
                : 'Sube prendas (superior, inferior, calzado) y genera un outfit arriba.'}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn-primary"
              disabled={status === 'processing'}
              onClick={runSimulation}
            >
              {status === 'processing' ? 'Procesando…' : 'Generar simulación'}
            </button>
            {!outfit && (
              <button type="button" className="btn-ghost-ink" onClick={onNeedOutfit}>
                Ir a generar outfit
              </button>
            )}
          </div>

          {error && (
            <p className="text-sm font-medium text-clay">{error}</p>
          )}
          {status === 'processing' && (
            <p className="font-display text-sm font-semibold tracking-wide text-saffron">
              {stepLabel}
            </p>
          )}
        </div>

        <div className="relative min-h-[460px] overflow-hidden rounded-2xl border border-ink/20 bg-ink shadow-[0_20px_60px_rgba(20,24,33,0.18)]">
          {!mainPhoto && !resultImage ? (
            <div className="flex h-full min-h-[460px] flex-col items-center justify-center px-6 text-center">
              <p className="font-display text-2xl font-bold text-porcelain">
                Tu espejo digital
              </p>
              <p className="mt-2 max-w-xs text-porcelain/70 italic">
                Toma tu foto y genera la simulación con tu ropa.
              </p>
            </div>
          ) : (
            <>
              <img
                src={resultImage || mainPhoto}
                alt="Resultado de simulación"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
              {status === 'processing' && <div className="ai-scan" />}

              {resultReady && outfit && (
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-5">
                  <p className="mb-2 font-display text-xs font-semibold tracking-[0.18em] text-saffron uppercase">
                    Resultado: tu foto + tus prendas
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {[outfit.superior, outfit.inferior, outfit.calzado].map((piece) => (
                      <div
                        key={piece.id}
                        className="overflow-hidden rounded-lg border border-porcelain/20 bg-ink/50 backdrop-blur-sm"
                      >
                        <div className="aspect-square">
                          <img
                            src={piece.imageUrl}
                            alt={piece.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {photoCount > 1 && (
                    <div className="mt-3 flex gap-1.5">
                      {ANGLES.filter((angle) => photos[angle.id]).map((angle) => (
                        <button
                          key={angle.id}
                          type="button"
                          onClick={() => {
                            setActiveAngle(angle.id)
                            setResultReady(false)
                            setResultImage('')
                          }}
                          className={`rounded-md px-2.5 py-1 font-display text-[0.65rem] font-semibold tracking-wide uppercase ${
                            activeAngle === angle.id
                              ? 'bg-saffron text-ink'
                              : 'bg-porcelain/15 text-porcelain'
                          }`}
                        >
                          {angle.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {status === 'done' && (
                <p className="absolute top-4 left-4 z-10 rounded-md border border-saffron/50 bg-ink/75 px-3 py-1 font-display text-[0.65rem] font-semibold tracking-[0.18em] text-saffron uppercase">
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
