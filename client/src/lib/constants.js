export const CATEGORIES = [
  { id: 'superior', label: 'Superior' },
  { id: 'inferior', label: 'Inferior' },
  { id: 'calzado', label: 'Calzado' },
]

export const COLORS = [
  'Negro',
  'Blanco',
  'Beige',
  'Azul',
  'Verde',
  'Rojo',
  'Gris',
  'Café',
  'Rosa',
  'Otro',
]

export const SEASONS = [
  { id: 'todas', label: 'Todas las temporadas' },
  { id: 'verano', label: 'Verano' },
  { id: 'invierno', label: 'Invierno' },
  { id: 'entretiempo', label: 'Entretiempo' },
]

export const CATEGORY_LABEL = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label])
)
