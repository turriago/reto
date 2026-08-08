function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('No se pudo leer la imagen'))
    reader.readAsDataURL(file)
  })
}

export async function uploadImage(file) {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      return response.json()
    }
  } catch {
    // Static hosting (Netlify) has no Express API — fall through.
  }

  const url = await fileToDataUrl(file)
  return {
    url,
    publicId: null,
    provider: 'local',
  }
}
