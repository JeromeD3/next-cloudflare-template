'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

import { SidebarProvider } from '@/components/ui/sidebar'
import { STORAGE_KEYS } from '@/config/constants'
import { useLocalStorage } from '@/hooks/use-local-storage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true
    }
  }
})

export function Providers({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage<boolean>(STORAGE_KEYS.SIDEBAR_STATE, true)

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <SidebarProvider defaultOpen={sidebarOpen} open={sidebarOpen} onOpenChange={setSidebarOpen}>
          {children}
        </SidebarProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
