function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('No se pudo cargar una imagen'))
    image.src = src
  })
}

function drawCover(ctx, image, x, y, w, h) {
  const scale = Math.max(w / image.width, h / image.height)
  const dw = image.width * scale
  const dh = image.height * scale
  const dx = x + (w - dw) / 2
  const dy = y + (h - dh) / 2
  ctx.drawImage(image, dx, dy, dw, dh)
}

function drawContain(ctx, image, x, y, w, h, alpha = 0.92) {
  const scale = Math.min(w / image.width, h / image.height)
  const dw = image.width * scale
  const dh = image.height * scale
  const dx = x + (w - dw) / 2
  const dy = y + (h - dh) / 2
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.drawImage(image, dx, dy, dw, dh)
  ctx.restore()
}

/**
 * Composes a person photo with outfit garments into a single preview image.
 * This is a product demo simulation (not a full generative VTO model).
 */
export async function composeTryOn({ personUrl, superiorUrl, inferiorUrl, calzadoUrl }) {
  const width = 720
  const height = 960
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  const [person, superior, inferior, calzado] = await Promise.all([
    loadImage(personUrl),
    loadImage(superiorUrl),
    loadImage(inferiorUrl),
    loadImage(calzadoUrl),
  ])

  ctx.fillStyle = '#141821'
  ctx.fillRect(0, 0, width, height)
  drawCover(ctx, person, 0, 0, width, height)

  // Soft veil so garments read as layered on the body.
  ctx.fillStyle = 'rgba(20, 24, 33, 0.18)'
  ctx.fillRect(0, 0, width, height)

  // Body regions (approximate full-body framing).
  drawContain(ctx, superior, width * 0.22, height * 0.18, width * 0.56, height * 0.28, 0.9)
  drawContain(ctx, inferior, width * 0.24, height * 0.44, width * 0.52, height * 0.3, 0.88)
  drawContain(ctx, calzado, width * 0.3, height * 0.74, width * 0.4, height * 0.16, 0.9)

  // Bottom label strip for demo clarity.
  const gradient = ctx.createLinearGradient(0, height * 0.78, 0, height)
  gradient.addColorStop(0, 'rgba(20,24,33,0)')
  gradient.addColorStop(1, 'rgba(20,24,33,0.75)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, height * 0.78, width, height * 0.22)

  ctx.fillStyle = '#c8963e'
  ctx.font = '600 18px Syne, sans-serif'
  ctx.fillText('SIMULACIÓN DE LOOK', 28, height - 48)
  ctx.fillStyle = '#f7f4ef'
  ctx.font = '500 14px Syne, sans-serif'
  ctx.fillText('Tu foto + tus prendas', 28, height - 26)

  return canvas.toDataURL('image/jpeg', 0.9)
}
