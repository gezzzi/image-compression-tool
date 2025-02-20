import { IMAGE_FORMATS } from '../constants/image-formats'

export function getOriginalFormat(file: File | null): string {
  if (!file) return ''
  const type = file.type.split('/')[1]
  return type === 'jpeg' ? 'jpg' : type
}

export function createImage(): HTMLImageElement {
  return document.createElement('img')
}

export async function convertToIco(img: HTMLImageElement): Promise<Blob> {
  const canvas = document.createElement('canvas')
  canvas.width = IMAGE_FORMATS.FAVICON_SIZE
  canvas.height = IMAGE_FORMATS.FAVICON_SIZE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')
  
  ctx.drawImage(img, 0, 0, IMAGE_FORMATS.FAVICON_SIZE, IMAGE_FORMATS.FAVICON_SIZE)
  
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('ICO conversion failed'))
    }, 'image/png')
  })
}

export async function convertToSvg(img: HTMLImageElement, isFavicon: boolean = false): Promise<Blob> {
  const canvas = document.createElement('canvas')
  const width = isFavicon ? IMAGE_FORMATS.FAVICON_SIZE : img.width
  const height = isFavicon ? IMAGE_FORMATS.FAVICON_SIZE : img.height
  
  canvas.width = width
  canvas.height = height
  
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas context not available')

  ctx.drawImage(img, 0, 0, width, height)

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <image width="${width}" height="${height}" href="${canvas.toDataURL('image/png')}" />
    </svg>
  `.trim()

  return new Blob([svgString], { type: 'image/svg+xml' })
}

export async function convertImageFormat(file: File, format: string, quality: number, originalImage: File | null): Promise<Blob> {
  const targetFormat = format === 'original' ? getOriginalFormat(originalImage) : format
  
  return new Promise((resolve, reject) => {
    const img = createImage()
    img.onload = async () => {
      try {
        if (targetFormat === 'svg' || targetFormat === 'svg-favicon') {
          return resolve(await convertToSvg(img, targetFormat === 'svg-favicon'))
        }

        if (targetFormat === 'ico') {
          return resolve(await convertToIco(img))
        }

        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (targetFormat === 'png-favicon') {
          width = height = IMAGE_FORMATS.FAVICON_SIZE
        } else if (targetFormat === 'png-apple-touch') {
          width = height = IMAGE_FORMATS.APPLE_TOUCH_SIZE
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas context not available'))

        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob)
            else reject(new Error('Blob conversion failed'))
          },
          `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`,
          quality
        )
      } catch (error) {
        reject(error)
      }
    }
    img.onerror = () => reject(new Error('Image loading failed'))
    img.src = URL.createObjectURL(file)
  })
} 