import { useEffect, useRef, useState } from 'react'

const ANGLES = [
  { id: 'frente', label: 'Frente', demo: '/demo/persona-frente.jpg' },
  { id: 'lado', label: 'Lado', demo: '/demo/persona-lado.jpg' },
  { id: 'espalda', label: 'Espalda', demo: '/demo/persona-espalda.jpg' },
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

export default function LookSimulator({ outfit, onPrepareDemo, autoDemoKey = 0 }) {
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
  const pendingSim = useRef(false)
  const lastAutoKey = useRef(0)

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (pendingSim.current && outfit) {
      pendingSim.current = false
      startProcessing()
    }
  }, [outfit])

  useEffect(() => {
    if (!autoDemoKey || autoDemoKey === lastAutoKey.current) return
    lastAutoKey.current = autoDemoKey
    loadDemoPhotos()
    if (outfit) {
      startProcessing()
    } else {
      pendingSim.current = true
      onPrepareDemo?.()
    }
  }, [autoDemoKey, outfit, onPrepareDemo])

  const hasPhoto = Boolean(photos.frente || photos.lado || photos.espalda)
  const mainPhoto =
    photos[activeAngle] || photos.frente || photos.lado || photos.espalda
  const photoCount = ANGLES.filter((angle) => photos[angle.id]).length
  const storePieces = outfit
    ? [outfit.superior, outfit.inferior, outfit.calzado].filter(
        (piece) => piece?.source === 'store'
      )
    : []
  const hasStoreMix = storePieces.length > 0

  async function handlePhoto(angleId, file) {
    if (!file) return
    const url = await readFile(file)
    setPhotos((prev) => ({ ...prev, [angleId]: url }))
    setActiveAngle(angleId)
    setResultReady(false)
  }

  function loadDemoPhotos() {
    setPhotos({
      frente: ANGLES[0].demo,
      lado: ANGLES[1].demo,
      espalda: ANGLES[2].demo,
    })
    setActiveAngle('frente')
    setResultReady(false)
    setStatus('idle')
  }

  function startProcessing() {
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

  function runSimulation() {
    if (!hasPhoto) {
      loadDemoPhotos()
    }

    if (!outfit) {
      pendingSim.current = true
      onPrepareDemo?.()
      return
    }

    if (!hasPhoto) {
      // photos just loaded synchronously above; continue
    }

    startProcessing()
  }

  function prepareFullDemo() {
    loadDemoPhotos()
    pendingSim.current = true
    onPrepareDemo?.()
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

      <div className="mb-5 flex flex-wrap gap-2 text-sm">
        <span
          className={`rounded-md px-3 py-1 font-display text-xs font-semibold tracking-wide uppercase ${
            photoCount > 0 ? 'bg-saffron/20 text-ink' : 'bg-white/60 text-ink-soft'
          }`}
        >
          1. Fotos {photoCount}/3
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
          3. Simulación {resultReady ? 'lista' : 'pendiente'}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8">
        <div className="panel space-y-5 rounded-2xl p-4 md:p-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {ANGLES.map((angle) => (
              <label
                key={angle.id}
                className={`relative flex min-h-40 cursor-pointer flex-col overflow-hidden rounded-xl border ${
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
              disabled={status === 'processing'}
              onClick={runSimulation}
            >
              {status === 'processing' ? 'Procesando…' : 'Generar simulación IA'}
            </button>
            <button
              type="button"
              className="btn-ghost-ink"
              disabled={status === 'processing'}
              onClick={prepareFullDemo}
            >
              Demo completa
            </button>
          </div>

          <p className="text-sm text-ink-soft italic">
            Tip: usa <strong>Demo completa</strong> para cargar fotos + outfit y
            simular al instante. O sube tus propias fotos en Frente / Lado /
            Espalda.
          </p>

          {status === 'processing' && (
            <p className="font-display text-sm font-semibold tracking-wide text-saffron">
              {stepLabel}
            </p>
          )}
        </div>

        <div className="relative min-h-[460px] overflow-hidden rounded-2xl border border-ink/20 bg-ink shadow-[0_20px_60px_rgba(20,24,33,0.18)]">
          {!mainPhoto ? (
            <div className="flex h-full min-h-[460px] flex-col items-center justify-center px-6 text-center">
              <p className="font-display text-2xl font-bold text-porcelain">
                Tu espejo digital
              </p>
              <p className="mt-2 max-w-xs text-porcelain/70 italic">
                Sube una foto o pulsa Demo completa.
              </p>
            </div>
          ) : (
            <>
              <img
                src={mainPhoto}
                alt="Simulación de persona"
                className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${
                  resultReady ? 'scale-[1.03] opacity-75' : 'opacity-95'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

              {status === 'processing' && <div className="ai-scan" />}

              {resultReady && outfit && (
                <div className="absolute inset-x-0 bottom-0 z-10 p-4 md:p-6">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="font-display text-xs font-semibold tracking-[0.2em] text-saffron uppercase">
                      {hasStoreMix
                        ? 'Look mixto · closet + tienda'
                        : 'Vista previa del look'}
                    </p>
                    <div className="flex gap-1.5">
                      {ANGLES.filter((angle) => photos[angle.id]).map((angle) => (
                        <button
                          key={angle.id}
                          type="button"
                          onClick={() => setActiveAngle(angle.id)}
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
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {[outfit.superior, outfit.inferior, outfit.calzado].map(
                      (piece, index) => (
                        <div
                          key={piece.id}
                          className="animate-outfit overflow-hidden rounded-xl border border-porcelain/20 bg-ink/60 backdrop-blur-md"
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
                            {piece.source === 'store' ? 'Tienda · ' : ''}
                            {piece.name}
                          </p>
                        </div>
                      )
                    )}
                  </div>
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
