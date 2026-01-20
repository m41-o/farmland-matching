export interface FarmlandFormData {
  name?: string
  prefecture: string
  city: string
  address: string
  area: number
  price?: number
  availableFrom: Date
  availableTo?: Date
  description?: string
  latitude?: number
  longitude?: number
  images?: string[]
}

export interface FarmlandSearchParams {
  prefecture?: string
  city?: string
  minArea?: number
  maxArea?: number
  minPrice?: number
  maxPrice?: number
  availableFrom?: Date
}

// 農地の詳細設備情報
export interface ListingFeatures {
  shed: {
    available: boolean
    hasLock?: boolean
    size?: string
    hasTools?: boolean
    toolList?: string[]
  }
  toilet: {
    available: boolean
    nearestPublicToilet?: string
  }
  water: {
    available: boolean
    type?: string
    nearestWaterPoint?: string
  }
  electricity: {
    available: boolean
  }
  communication: {
    signal5g: boolean
    signal4g: boolean
    signal4gStrength: number // 1-4 scale
    wifi: boolean
  }
  access: {
    lightTruckAccessible: boolean
    roadWidth?: string
    parking: boolean
    parkingSpaces?: number
  }
}

// 周囲環境情報
export interface Surrounding {
  type: "farmland" | "forest" | "housing"
  direction: string
  description: string
}

// 最寄り施設情報
export interface NearestFacility {
  distance: string
  time: string
}

// 自治体支援情報
export interface MunicipalitySupport {
  title: string
  description: string
  icon: "coins" | "graduation" | "landmark"
}

// 完全な農地リスティング
export interface Listing {
  id: string
  title: string
  location: string
  prefecture: string
  city: string
  area: number
  price: number
  images: string[]
  lat: number
  lng: number
  features: ListingFeatures
  description: string
  surroundings: {
    adjacent: Surrounding[]
    nearestFacilities: {
      publicToilet: NearestFacility
      waterPoint: NearestFacility
      convenienceStore: NearestFacility
      directSalesShop: NearestFacility
    }
    roadWidth: string
    nearestHouse: string
    parking: string
    publicTransport: string
  }
  owner: {
    name: string
    type: string
  }
  municipalitySupport: MunicipalitySupport[]
  isNew: boolean
}

// サンプルデータ
export const listings: Listing[] = [
  {
    id: "cmkgm2jd80002bpn42v0b8imy",
    title: "日当たり良好な水田",
    location: "長野県松本市梓川梓1234-5",
    prefecture: "長野県",
    city: "松本市",
    area: 1200,
    price: 8000,
    images: [
      "/images/japanese-countryside-road-next-to-farmland.jpg",
      "/images/japanese-farm-parking-area-gravel-lot.jpg",
    ],
    lat: 36.2,
    lng: 137.97,
    features: {
      shed: {
        available: true,
        hasLock: true,
        size: "約6畳（10㎡）",
        hasTools: true,
        toolList: ["鍬", "スコップ", "一輪車"],
      },
      toilet: {
        available: false,
        nearestPublicToilet: "500m（徒歩7分）",
      },
      water: {
        available: true,
        type: "用水路引水",
        nearestWaterPoint: "農地内",
      },
      electricity: {
        available: false,
      },
      communication: {
        signal5g: false,
        signal4g: true,
        signal4gStrength: 3,
        wifi: false,
      },
      access: {
        lightTruckAccessible: true,
        roadWidth: "4m",
        parking: true,
        parkingSpaces: 2,
      },
    },
    description: `南向きで日当たり抜群の水田です。用水路からの引水が可能で、米作りに最適な環境が整っています。

近隣農家との関係も良好で、初心者の方へのアドバイスも期待できます。春から秋にかけては、アルプスの美しい山並みを眺めながら農作業ができる、恵まれた立地です。

周辺には直売所もあり、収穫物の販売先にも困りません。`,
    surroundings: {
      adjacent: [
        { type: "farmland", direction: "北", description: "水田（稲作）" },
        { type: "forest", direction: "東", description: "雑木林" },
        { type: "housing", direction: "南", description: "民家（約50m）" },
        { type: "farmland", direction: "西", description: "畑（野菜栽培）" },
      ],
      nearestFacilities: {
        publicToilet: { distance: "500m", time: "徒歩7分" },
        waterPoint: { distance: "農地内", time: "-" },
        convenienceStore: { distance: "2km", time: "車5分" },
        directSalesShop: { distance: "800m", time: "徒歩10分" },
      },
      roadWidth: "4m（軽トラック通行可）",
      nearestHouse: "約50m",
      parking: "2台分のスペースあり",
      publicTransport: "最寄りバス停まで徒歩10分",
    },
    owner: {
      name: "松本市農業委員会",
      type: "自治体",
    },
    municipalitySupport: [
      {
        title: "新規就農者支援補助金",
        description: "最大150万円の就農準備資金を支給",
        icon: "coins",
      },
      {
        title: "農業体験研修制度",
        description: "6ヶ月間の実践研修プログラム（無料）",
        icon: "graduation",
      },
      {
        title: "農地取得支援",
        description: "農地購入時の手数料減免制度あり",
        icon: "landmark",
      },
    ],
    isNew: true,
  },
  {
    id: "cmkgmnvk90008bpn45gcetyl2",
    title: "有機栽培向け畑地",
    location: "千葉県南房総市白浜町5678",
    prefecture: "千葉県",
    city: "南房総市",
    area: 800,
    price: 5000,
    images: [
      "/images/japanese-organic-vegetable-farm-field-with-ocean-v.jpg",
      "/images/japanese-farm-toilet-facility-small-building.jpg",
    ],
    lat: 34.9,
    lng: 139.95,
    features: {
      shed: {
        available: false,
      },
      toilet: {
        available: true,
        nearestPublicToilet: "敷地内",
      },
      water: {
        available: true,
        type: "井戸水",
        nearestWaterPoint: "農地内",
      },
      electricity: {
        available: true,
      },
      communication: {
        signal5g: true,
        signal4g: true,
        signal4gStrength: 4,
        wifi: false,
      },
      access: {
        lightTruckAccessible: true,
        roadWidth: "5m",
        parking: true,
        parkingSpaces: 3,
      },
    },
    description: `温暖な気候で一年中栽培可能な畑地です。有機認証取得済みの土壌で、付加価値の高い有機野菜の栽培に最適です。

海からの潮風を適度に受け、ミネラル豊富な野菜が育ちます。近隣には道の駅があり、直売に便利な立地です。

5G電波も良好で、スマート農業の実践にも適しています。`,
    surroundings: {
      adjacent: [
        { type: "farmland", direction: "北", description: "畑（花卉栽培）" },
        { type: "farmland", direction: "東", description: "畑（野菜）" },
        { type: "housing", direction: "南", description: "民家（約100m）" },
        { type: "forest", direction: "西", description: "防風林" },
      ],
      nearestFacilities: {
        publicToilet: { distance: "敷地内", time: "-" },
        waterPoint: { distance: "敷地内", time: "-" },
        convenienceStore: { distance: "1.5km", time: "車3分" },
        directSalesShop: { distance: "500m", time: "徒歩6分" },
      },
      roadWidth: "5m（軽トラック通行可）",
      nearestHouse: "約100m",
      parking: "3台分のスペースあり",
      publicTransport: "最寄りバス停まで徒歩15分",
    },
    owner: {
      name: "南房総市農政課",
      type: "自治体",
    },
    municipalitySupport: [
      {
        title: "移住就農支援金",
        description: "移住者限定で最大200万円を支給",
        icon: "coins",
      },
      {
        title: "農業インターン制度",
        description: "3ヶ月間の就農体験プログラム",
        icon: "graduation",
      },
      {
        title: "空き家バンク連携",
        description: "農地近くの住居紹介サービス",
        icon: "landmark",
      },
    ],
    isNew: false,
  },
  {
    id: "cmkgmnvk90009bpn44tsug3ix",
    title: "ビニールハウス付き農地",
    location: "静岡県浜松市北区引佐町910",
    prefecture: "静岡県",
    city: "浜松市",
    area: 2000,
    price: 15000,
    images: [
      "/images/japanese-vinyl-greenhouse-structure-farmland.jpg",
      "/images/inside-japanese-greenhouse-strawberry-cultivation.jpg",
    ],
    lat: 34.85,
    lng: 137.75,
    features: {
      shed: {
        available: true,
        hasLock: true,
        size: "約10畳（16㎡）",
        hasTools: true,
        toolList: ["耕運機", "噴霧器", "収穫カゴ", "保冷コンテナ"],
      },
      toilet: {
        available: true,
        nearestPublicToilet: "敷地内",
      },
      water: {
        available: true,
        type: "上水道",
        nearestWaterPoint: "農地内",
      },
      electricity: {
        available: true,
      },
      communication: {
        signal5g: false,
        signal4g: true,
        signal4gStrength: 3,
        wifi: true,
      },
      access: {
        lightTruckAccessible: true,
        roadWidth: "6m",
        parking: true,
        parkingSpaces: 4,
      },
    },
    description: `50坪のビニールハウス3棟付きの充実した農地です。イチゴ栽培の実績があり、設備もそのまま使用可能です。

上水道完備で衛生的な栽培が可能。Wi-Fi環境も整っており、IoTセンサーを活用した温度管理などスマート農業を実践できます。

浜松インターから車で15分とアクセスも良好です。`,
    surroundings: {
      adjacent: [
        { type: "farmland", direction: "北", description: "ビニールハウス（トマト）" },
        { type: "farmland", direction: "東", description: "畑（メロン）" },
        { type: "farmland", direction: "南", description: "果樹園（みかん）" },
        { type: "housing", direction: "西", description: "農家住宅（約30m）" },
      ],
      nearestFacilities: {
        publicToilet: { distance: "敷地内", time: "-" },
        waterPoint: { distance: "敷地内", time: "-" },
        convenienceStore: { distance: "3km", time: "車7分" },
        directSalesShop: { distance: "2km", time: "車5分" },
      },
      roadWidth: "6m（大型車通行可）",
      nearestHouse: "約30m",
      parking: "4台分のスペースあり",
      publicTransport: "最寄り駅まで車10分",
    },
    owner: {
      name: "浜松市農業振興課",
      type: "自治体",
    },
    municipalitySupport: [
      {
        title: "施設園芸支援補助金",
        description: "ハウス修繕費の50%を補助（上限100万円）",
        icon: "coins",
      },
      {
        title: "農業技術研修",
        description: "イチゴ栽培の専門研修（年2回開催）",
        icon: "graduation",
      },
      {
        title: "販路開拓支援",
        description: "地元スーパーとのマッチング支援",
        icon: "landmark",
      },
    ],
    isNew: true,
  },
  {
    id: "cmkgmnvk9000abpn4q91zb5de",
    title: "山間部の段々畑",
    location: "新潟県十日町市松代1122",
    prefecture: "新潟県",
    city: "十日町市",
    area: 1500,
    price: 6000,
    images: [
      "/images/japanese-terraced-rice-field-mountains-beautiful-l.jpg",
      "/images/japanese-mountain-stream-water-source.jpg",
    ],
    lat: 37.15,
    lng: 138.65,
    features: {
      shed: {
        available: true,
        hasLock: false,
        size: "約4畳（6㎡）",
        hasTools: false,
        toolList: [],
      },
      toilet: {
        available: false,
        nearestPublicToilet: "1km（車3分）",
      },
      water: {
        available: true,
        type: "山水引水",
        nearestWaterPoint: "農地内",
      },
      electricity: {
        available: false,
      },
      communication: {
        signal5g: false,
        signal4g: false,
        signal4gStrength: 0,
        wifi: false,
      },
      access: {
        lightTruckAccessible: false,
        roadWidth: "2.5m",
        parking: false,
        parkingSpaces: 0,
      },
    },
    description: `美しい棚田で伝統的な米作りを体験できます。自然豊かな環境で、農薬を使わない栽培に最適です。

山からの清らかな湧き水を利用でき、水質は抜群です。電波は届きにくいですが、その分自然に没頭できる環境です。

地域の農家と協力して、棚田オーナー制度の運営も可能です。`,
    surroundings: {
      adjacent: [
        { type: "farmland", direction: "北", description: "棚田（休耕）" },
        { type: "forest", direction: "東", description: "ブナ林" },
        { type: "forest", direction: "南", description: "杉林" },
        { type: "farmland", direction: "西", description: "棚田（稲作）" },
      ],
      nearestFacilities: {
        publicToilet: { distance: "1km", time: "車3分" },
        waterPoint: { distance: "農地内", time: "-" },
        convenienceStore: { distance: "8km", time: "車15分" },
        directSalesShop: { distance: "3km", time: "車6分" },
      },
      roadWidth: "2.5m（軽自動車のみ通行可）",
      nearestHouse: "約200m",
      parking: "路肩駐車のみ",
      publicTransport: "最寄りバス停まで徒歩30分",
    },
    owner: {
      name: "十日町市中山間地域振興課",
      type: "自治体",
    },
    municipalitySupport: [
      {
        title: "中山間地域支援金",
        description: "棚田保全活動に年間30万円を支給",
        icon: "coins",
      },
      {
        title: "移住定住促進事業",
        description: "住居費補助と農業研修セット支援",
        icon: "graduation",
      },
      {
        title: "棚田オーナー制度支援",
        description: "制度運営のノウハウ提供と広報支援",
        icon: "landmark",
      },
    ],
    isNew: false,
  },
  {
    id: "cmkgmnvka000bbpn4qowlyq0y",
    title: "市街地近くの畑",
    location: "埼玉県さいたま市見沼区3344",
    prefecture: "埼玉県",
    city: "さいたま市",
    area: 500,
    price: 12000,
    images: [
      "/images/japanese-urban-vegetable-farm-field-city-nearby.jpg",
      "/images/japanese-farm-water-faucet-modern-facility.jpg",
    ],
    lat: 35.9,
    lng: 139.7,
    features: {
      shed: {
        available: false,
      },
      toilet: {
        available: true,
        nearestPublicToilet: "敷地内",
      },
      water: {
        available: true,
        type: "上水道",
        nearestWaterPoint: "農地内",
      },
      electricity: {
        available: true,
      },
      communication: {
        signal5g: true,
        signal4g: true,
        signal4gStrength: 4,
        wifi: false,
      },
      access: {
        lightTruckAccessible: true,
        roadWidth: "6m",
        parking: true,
        parkingSpaces: 2,
      },
    },
    description: `都心からアクセス良好な畑地です。週末農業にも最適で、電車でも通える立地が魅力です。

上水道・電気完備で、初心者でも安心して農業を始められます。5G電波も良好で、リモートワークとの両立も可能です。

近隣には農業体験施設もあり、アドバイスを受けやすい環境です。`,
    surroundings: {
      adjacent: [
        { type: "farmland", direction: "北", description: "市民農園" },
        { type: "housing", direction: "東", description: "住宅地（約20m）" },
        { type: "farmland", direction: "南", description: "畑（野菜）" },
        { type: "housing", direction: "西", description: "アパート（約30m）" },
      ],
      nearestFacilities: {
        publicToilet: { distance: "敷地内", time: "-" },
        waterPoint: { distance: "敷地内", time: "-" },
        convenienceStore: { distance: "300m", time: "徒歩4分" },
        directSalesShop: { distance: "1km", time: "徒歩12分" },
      },
      roadWidth: "6m（大型車通行可）",
      nearestHouse: "約20m",
      parking: "2台分のスペースあり",
      publicTransport: "最寄り駅まで徒歩15分",
    },
    owner: {
      name: "さいたま市農業政策課",
      type: "自治体",
    },
    municipalitySupport: [
      {
        title: "都市農業支援補助金",
        description: "農業資材購入費の30%を補助",
        icon: "coins",
      },
      {
        title: "週末農業スクール",
        description: "初心者向け栽培講座（月2回開催）",
        icon: "graduation",
      },
      {
        title: "農産物直売支援",
        description: "地元マルシェへの出店サポート",
        icon: "landmark",
      },
    ],
    isNew: true,
  },
]

// ユーティリティ関数
export function getListingById(id: string): Listing | undefined {
  return listings.find((listing) => listing.id === id)
}

export function getFeaturedListings(): Listing[] {
  return listings.filter((listing) => listing.isNew).slice(0, 3)
}

// 検索ページ用の簡易版データ
export async function getSearchListings() {
  try {
    // APIから農地一覧を取得
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/farmland?limit=100`, {
      cache: 'no-store' // キャッシュを無効化
    })
    
    if (!response.ok) {
      // APIエラーの場合はダミーデータを返す
      return listings.map((listing) => ({
        id: listing.id,
        title: listing.title,
        location: listing.location,
        prefecture: listing.prefecture,
        city: listing.city,
        area: listing.area,
        price: listing.price,
        image: listing.images[0],
        lat: listing.lat,
        lng: listing.lng,
        features: {
          shed: listing.features.shed.available,
          toilet: listing.features.toilet.available,
          water: listing.features.water.available,
          electricity: listing.features.electricity.available,
          signal5g: listing.features.communication.signal5g,
          signal4g: listing.features.communication.signal4g,
          parking: listing.features.access.parking,
        },
        description: listing.description.split("\n")[0],
      }))
    }

    const data = await response.json()
    
    // APIから取得したデータをマップ
    return data.data.map((farmland: any) => ({
      id: farmland.id,
      title: farmland.name || '農地',
      location: `${farmland.prefecture}${farmland.city}${farmland.address}`,
      prefecture: farmland.prefecture,
      city: farmland.city,
      area: farmland.area,
      price: farmland.price || 0,
      image: farmland.images?.[0] || '/placeholder.svg',
      lat: farmland.latitude || 36.8,
      lng: farmland.longitude || 137.7,
      features: {
        shed: false,
        toilet: false,
        water: false,
        electricity: false,
        signal5g: false,
        signal4g: false,
        parking: false,
      },
      description: farmland.description || '農地',
    }))
  } catch (error) {
    console.error('検索データ取得エラー:', error)
    // エラー時はダミーデータを返す
    return listings.map((listing) => ({
      id: listing.id,
      title: listing.title,
      location: listing.location,
      prefecture: listing.prefecture,
      city: listing.city,
      area: listing.area,
      price: listing.price,
      image: listing.images[0],
      lat: listing.lat,
      lng: listing.lng,
      features: {
        shed: listing.features.shed.available,
        toilet: listing.features.toilet.available,
        water: listing.features.water.available,
        electricity: listing.features.electricity.available,
        signal5g: listing.features.communication.signal5g,
        signal4g: listing.features.communication.signal4g,
        parking: listing.features.access.parking,
      },
      description: listing.description.split("\n")[0],
    }))
  }
}
