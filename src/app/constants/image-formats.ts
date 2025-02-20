export const IMAGE_FORMATS = {
  FAVICON_SIZE: 32,
  APPLE_TOUCH_SIZE: 180,
  MIME_TYPES: {
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
    'svg-favicon': 'image/svg+xml',
    jpg: 'image/jpeg',
  } as const
}

export const FORMAT_OPTIONS = [
  { value: 'original', label: '元画像と同じ' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'svg', label: 'SVG' },
  { value: 'ico', label: 'ICO (Favicon用 32x32)' },
  { value: 'svg-favicon', label: 'SVG (Favicon用 32x32)' },
  { value: 'png-favicon', label: 'PNG (Favicon用 32x32)' },
  { value: 'png-apple-touch', label: 'PNG (Apple Touch Icon用 180x180)' },
] as const 