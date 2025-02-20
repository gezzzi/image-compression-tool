'use client'

import { useState, useEffect, useCallback } from 'react'
import imageCompression from 'browser-image-compression'
import Image from 'next/image'
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDropzone } from 'react-dropzone'
import { FileIcon } from 'lucide-react'
import { convertImageFormat, getOriginalFormat } from '../utils/image-converter'
import { FORMAT_OPTIONS, IMAGE_FORMATS } from '../constants/image-formats'
import type { OutputFormat } from '../types/image-compressor'

// 型定義の更新
declare module 'browser-image-compression' {
  interface Options {
    maxSizeMB?: number
    maxWidthOrHeight?: number 
    useWebWorker?: boolean
    initialQuality?: number
  }
}

export default function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const [compressedImage, setCompressedImage] = useState<File | null>(null)
  const [compressedImageUrl, setCompressedImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)
  
  // 圧縮設定の状態
  const [quality, setQuality] = useState(0.7)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('original')
  const [currentFormat, setCurrentFormat] = useState<OutputFormat>('original')
  const [sizeWarning, setSizeWarning] = useState<string | null>(null)

  useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage)
      setOriginalImageUrl(url)
      
      // クリーンアップ関数
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [originalImage])


  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setCompressedImage(null)
    setCompressedImageUrl(null)
    setOriginalImage(file)
    // 自動圧縮を削除
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  })

  // handleCompress関数を修正
  const handleCompress = async () => {
    if (!originalImage) return
    setLoading(true)
    setSizeWarning(null)

    try {
      const options = {
        useWebWorker: true,
        initialQuality: quality,
      }

      const compressedFile = await imageCompression(originalImage, options)
      const convertedBlob = await convertImageFormat(compressedFile, outputFormat, quality, originalImage)
      const compressedURL = URL.createObjectURL(convertedBlob)
      
      // 圧縮・変換時の出力フォーマットを保存
      setCurrentFormat(outputFormat)
      
      const finalFormat = outputFormat === 'original' ? getOriginalFormat(originalImage) : outputFormat
      const mimeType = IMAGE_FORMATS.MIME_TYPES[finalFormat as keyof typeof IMAGE_FORMATS.MIME_TYPES] || `image/${finalFormat}`
      const fileExtension = finalFormat === 'svg-favicon' ? 'svg' : finalFormat
      
      const convertedFile = new File([convertedBlob], `converted.${fileExtension}`, {
        type: mimeType
      })

      // サイズチェックを追加
      if (convertedFile.size > originalImage.size) {
        setSizeWarning(`変換後のファイルサイズ（${(convertedFile.size / 1024 / 1024).toFixed(2)} MB）が元のサイズ（${(originalImage.size / 1024 / 1024).toFixed(2)} MB）より大きくなっています。フォーマットの変換による影響ですが、使用には問題ありません。`)
      }
      
      setCompressedImage(convertedFile)
      setCompressedImageUrl(compressedURL)
    } catch (error) {
      console.error('圧縮エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  // handleDownload関数を修正
  const handleDownload = () => {
    if (!compressedImage || !compressedImageUrl) return
    
    const baseName = originalImage?.name.split('.')[0] || 'image'
    const extension = (() => {
      if (currentFormat === 'original') return getOriginalFormat(originalImage)
      if (currentFormat === 'svg-favicon') return 'svg'
      if (currentFormat === 'png-apple-touch') return 'png'
      return currentFormat
    })()
    const fileName = `${baseName}-compressed.${extension}`
    
    const link = document.createElement('a')
    link.href = compressedImageUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div {...getRootProps()} className="relative">
        <input {...getInputProps()} />
        <div className={`
          border-2 border-dashed rounded-lg p-12
          flex flex-col items-center justify-center
          min-h-[300px] cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}>
          <div className="text-center space-y-4">
            <FileIcon className="w-16 h-16 mx-auto text-gray-400" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-700">
                ドラッグ＆ドロップで
                <br />
                画像をアップロード
              </h3>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                または、ファイルを選択
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>画質 ({(quality * 100).toFixed(0)}%)</Label>
          <Slider
            value={[quality * 100]}
            onValueChange={(value: number[]) => setQuality(value[0] / 100)}
            min={1}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex gap-4 items-end">
          <div className="w-1/2 space-y-2">
            <Label>出力フォーマット</Label>
            <Select
              value={outputFormat}
              onValueChange={(value: OutputFormat) => setOutputFormat(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="フォーマットを選択" />
              </SelectTrigger>
              <SelectContent>
                {FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 flex justify-center">
            <button
              onClick={handleCompress}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 h-10"
              disabled={loading || !originalImage}
            >
              圧縮・変換
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <p>圧縮中...</p>
        </div>
      )}

      {sizeWarning && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">{sizeWarning}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {originalImage && originalImageUrl && (
          <div>
            <h2 className="font-bold mb-2 text-center">元の画像</h2>
            <div className="relative w-full aspect-square">
              <Image
                src={originalImageUrl}
                alt="Original"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p className="text-center">サイズ: {(originalImage.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}

        {compressedImageUrl && (
          <div>
            <h2 className="font-bold mb-2 text-center">圧縮後の画像</h2>
            <div className="relative w-full aspect-square">
              <Image
                src={compressedImageUrl}
                alt="Compressed"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="space-y-2">
              <p className="text-center">サイズ: {compressedImage ? (compressedImage.size / 1024 / 1024).toFixed(2) : 0} MB</p>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full"
              >
                ダウンロード
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 