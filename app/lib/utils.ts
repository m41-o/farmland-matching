// 画像配列をJSONに変換（MySQL用）
export function imagesToJson(images: string[]): any {
    return images
  }
  
  // JSONから画像配列に変換
  export function jsonToImages(json: any): string[] {
    if (Array.isArray(json)) {
      return json
    }
    if (typeof json === 'string') {
      try {
        return JSON.parse(json)
      } catch {
        return []
      }
    }
    return []
  }
  
  // 日付フォーマット
  export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }