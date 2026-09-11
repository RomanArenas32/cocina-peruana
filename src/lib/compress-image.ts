/**
 * Comprime una imagen antes de subirla.
 * - Redimensiona a máximo 1200px de ancho manteniendo proporción
 * - Convierte a WebP con calidad 85%
 */
export function compressImage(file: File, maxWidth = 1200, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const scale = Math.min(1, maxWidth / img.width)
      const width = Math.round(img.width * scale)
      const height = Math.round(img.height * scale)

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas no disponible'))

      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Error al comprimir imagen'))
        },
        'image/webp',
        quality
      )
    }

    img.onerror = () => reject(new Error('Error al cargar imagen'))
    img.src = url
  })
}
