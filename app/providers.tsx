'use client'

import type React from 'react'
// @ts-ignore
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

// QueryClient インスタンスを作成（一度だけ）
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // キャッシュ時間: 5分
      staleTime: 5 * 60 * 1000,
      // ガベージコレクション: 10分
      gcTime: 10 * 60 * 1000,
    },
  },
})

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  )
}
