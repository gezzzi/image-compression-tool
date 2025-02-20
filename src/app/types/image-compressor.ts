export interface ImageCompressionOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number 
  useWebWorker?: boolean
  initialQuality?: number
}

export type OutputFormat = 'jpg' | 'png' | 'webp' | 'ico' | 'svg' | 'svg-favicon' | 'png-favicon' | 'png-apple-touch' | 'original' 