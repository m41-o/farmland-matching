import { prisma } from '../app/lib/prisma'
import { FarmlandStatus } from '@prisma/client'

const seedFarmlands = async () => {
  const farmlands = [
    {
      id: "cmkgm2jd80002bpn42v0b8imy",
      title: "日当たり良好な水田",
      prefecture: "長野県",
      city: "松本市",
      address: "梓川梓1234-5",
      area: 12007,
      price: 8000,
      availableFrom: new Date("1970-01-01T00:00:00.000Z"),
      availableTo: null,
      description: "南向きで日当たり抜群の水田",
      latitude: 36.2,
      longitude: 137.97,
      images: [
        "/images/japanese-countryside-road-next-to-farmland.jpg",
        "/images/japanese-farm-parking-area-gravel-lot.jpg"
      ],
      status: FarmlandStatus.PUBLIC,
      createdAt: new Date(),
      updatedAt: new Date(),
      providerId: "cmkglviwc0000bpn472qa95nl",
    },
    {
      id: "cmkgmnvk90008bpn45gcetyl2",
      title: "有機栽培向け畑地",
      prefecture: "千葉県",
      city: "南房総市",
      address: "白浜町5678",
      area: 800,
      price: 5000,
      availableFrom: new Date("1970-01-01T00:00:00.000Z"),
      availableTo: null,
      description: "温暖な気候で一年中栽培可能な畑地です。",
      latitude: 34.9,
      longitude: 139.95,
      images: [
        "/images/japanese-organic-vegetable-farm-field-with-ocean-v.jpg",
        "/images/japanese-farm-toilet-facility-small-building.jpg"
      ],
      status: FarmlandStatus.PUBLIC,
      createdAt: new Date(),
      updatedAt: new Date(),
      providerId: "cmkglviwc0000bpn472qa95nl",
    },
    {
      id: "cmkgmnvk90009bpn44tsug3ix",
      title: "ビニールハウス付き農地",
      prefecture: "静岡県",
      city: "浜松市",
      address: "引佐町910",
      area: 2000,
      price: 15000,
      availableFrom: new Date("1970-01-01T00:00:00.000Z"),
      availableTo: null,
      description: "イチゴ栽培の実績があり、設備もそのまま使用可能です。",
      latitude: 34.85,
      longitude: 137.75,
      images: [
        "/images/japanese-vinyl-greenhouse-structure-farmland.jpg",
        "/images/inside-japanese-greenhouse-strawberry-cultivation.jpg"
      ],
      status: FarmlandStatus.PUBLIC,
      createdAt: new Date(),
      updatedAt: new Date(),
      providerId: "cmkglviwc0000bpn472qa95nl",
    },
    {
      id: "cmkgmnvk9000abpn4q91zb5de",
      title: "山間部の段々畑",
      prefecture: "新潟県",
      city: "十日町市",
      address: "松代1122",
      area: 1500,
      price: 6000,
      availableFrom: new Date("1970-01-01T00:00:00.000Z"),
      availableTo: null,
      description: "美しい棚田で伝統的な米作りを体験できます。",
      latitude: 37.15,
      longitude: 138.65,
      images: [
        "/images/japanese-terraced-rice-field-mountains-beautiful-l.jpg",
        "/images/japanese-mountain-stream-water-source.jpg"
      ],
      status: FarmlandStatus.PUBLIC,
      createdAt: new Date(),
      updatedAt: new Date(),
      providerId: "cmkglviwc0000bpn472qa95nl",
    },
    {
      id: "cmkgmnvka000bbpn4qowlyq0y",
      title: "市街地近くの畑",
      prefecture: "埼玉県",
      city: "さいたま市",
      address: "見沼区3344",
      area: 500,
      price: 12000,
      availableFrom: new Date("1970-01-01T00:00:00.000Z"),
      availableTo: null,
      description: "アクセス良好な畑地です。",
      latitude: 35.9,
      longitude: 139.7,
      images: [
        "/images/japanese-urban-vegetable-farm-field-city-nearby.jpg",
        "/images/japanese-farm-water-faucet-modern-facility.jpg"
      ],
      status: FarmlandStatus.PUBLIC,
      createdAt: new Date(),
      updatedAt: new Date(),
      providerId: "cmkglviwc0000bpn472qa95nl",
    },
  ];

  // 既存データを削除してから追加
  await prisma.farmland.deleteMany({
    where: {
      id: {
        in: farmlands.map(f => f.id)
      }
    }
  });

  // 新しいデータを追加
  await prisma.farmland.createMany({ data: farmlands });
  console.log('✅ 農地のデータを追加しました！');
};

seedFarmlands()
  .catch(e => {
    console.error('❌ エラー:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
