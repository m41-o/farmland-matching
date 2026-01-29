/** @type {import('next').NextConfig} */
const nextConfig = {
  // API のペイロードサイズ制限を 50MB に設定
  // 画像アップロード時に大容量のデータを扱うため
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
  // その他の Next.js 設定
  reactStrictMode: true,
}

export default nextConfig
