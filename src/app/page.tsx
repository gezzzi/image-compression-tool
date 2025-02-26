import ImageCompressor from './components/ImageCompressor'

export default function Home() {
  return (
    <main className="container mx-auto min-h-screen p-4 md:p-8 max-w-5xl">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            画像圧縮・変換ツール
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            簡単な操作で画像を圧縮・変換できます。WebP、SVG、JPGなど、様々なフォーマットに対応。
            <br />
            デバイス内で圧縮するため、サーバーにアップロードすることなく、安全に圧縮できます。
          </p>
        </div>
        <ImageCompressor />
      </div>
    </main>
  );
}
