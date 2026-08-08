import { useState } from 'react'
import { uploadImage } from '../lib/api'
import { CATEGORIES, COLORS, SEASONS } from '../lib/constants'

const emptyForm = {
  name: '',
  category: 'superior',
  color: 'Negro',
  season: 'todas',
}

export default function ItemForm({ onAdd }) {
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0]
    if (!nextFile) return
    setFile(nextFile)
    setPreview(URL.createObjectURL(nextFile))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!file) {
      setError('Sube una imagen de la prenda.')
      return
    }

    if (!form.name.trim()) {
      setError('Dale un nombre a la prenda.')
      return
    }

    setLoading(true)
    try {
      const uploaded = await uploadImage(file)
      onAdd({
        id: crypto.randomUUID(),
        name: form.name.trim(),
        category: form.category,
        color: form.color,
        season: form.season,
        imageUrl: uploaded.url,
        createdAt: new Date().toISOString(),
      })
      setForm(emptyForm)
      setFile(null)
      setPreview('')
      setSuccess('Prenda guardada en tu closet.')
      event.target.reset()
    } catch (err) {
      setError(err.message || 'No se pudo guardar la prenda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="agregar" className="animate-rise-delay-1">
      <div className="mb-8">
        <p className="section-mark font-display text-xs font-semibold tracking-[0.22em] text-saffron uppercase">
          Inventario
        </p>
        <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Registra una prenda
        </h2>
        <p className="mt-3 max-w-xl text-lg text-ink-soft italic">
          Sube la foto, elige categoría y deja que el estilista combine por ti.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[240px_1fr]"
      >
        <label className="group relative flex min-h-64 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-white/50 transition hover:border-saffron">
          {preview ? (
            <img
              src={preview}
              alt="Vista previa"
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="px-4 text-center">
              <p className="font-display font-semibold text-ink">Subir imagen</p>
              <p className="mt-1 text-sm text-ink-soft italic">JPG o PNG · máx 8MB</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handleFileChange}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field sm:col-span-2">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. Camisa lino arena"
            />
          </div>

          <div className="field">
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="color">Color</label>
            <select
              id="color"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
            >
              {COLORS.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          <div className="field sm:col-span-2">
            <label htmlFor="season">Temporada</label>
            <select
              id="season"
              value={form.season}
              onChange={(e) => setForm({ ...form, season: e.target.value })}
            >
              {SEASONS.map((season) => (
                <option key={season.id} value={season.id}>
                  {season.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Guardando…' : 'Agregar al closet'}
            </button>
            {error && <p className="text-sm font-medium text-clay">{error}</p>}
            {success && (
              <p className="text-sm font-medium text-sage-deep">{success}</p>
            )}
          </div>
        </div>
      </form>
    </section>
  )
}
