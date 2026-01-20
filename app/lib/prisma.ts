import { PrismaClient } from '@prisma/client'

// Node.js環境では、アプリのホットリロード等により同じファイルが何度も評価されることがあります。
// その場合、PrismaClientを都度newするとDBコネクションが無限に増えてしまう問題があるため、
// globalThisオブジェクトを使ってPrismaClientのインスタンスをグローバルに1つだけ共有します。
// 型安全のため、globalThisを拡張するオブジェクト型をここで宣言しています。
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// グローバル変数globalForPrisma.prismaがundefinedの場合は、新しいPrismaClientのインスタンスを作成します。
// そうでない場合は、既存のインスタンスを使用します。
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// 本番環境では、globalForPrisma.prismaにインスタンスを代入しないことで、
// ホットリロード時に新しいインスタンスが作成されないようにします。

// ホットリロード（Hot Reload）は、ソースコードを変更した際にアプリケーションを完全に再起動することなく、
// その変更を即座に反映・適用できる開発支援の仕組みです。
// これにより、開発者はリアルタイムで変更内容を確認しながら効率的に開発を進めることが可能ですが、
// サーバーサイド環境（例: Next.jsの開発環境など）ではモジュールの再評価が繰り返され、
// シングルトンであるべきインスタンスが複数生成される副作用が生じることがあります。
// PrismaクライアントのようにDBコネクションを管理するオブジェクトは、
// ホットリロードの影響でコネクション過多になるのを防ぐためグローバル変数で管理することが推奨されています。

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// グローバル変数とは、プログラム全体、もしくは特定のスコープ（この場合はNode.jsのglobalThis）で共有される変数のことです。
// どこからでもアクセス・利用できるため、状態の共有やシングルトンパターンの実現時などに使われます。