'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

import Chat from '@/components/chat/chat'

export default function ChatPage() {
  const params = useParams()
  const chatId = params?.id as string
  const queryClient = useQueryClient()
  const session = useSession()
  const user = session.data?.user
  const userId = user?.id ?? ''

  // Prefetch chat data
  useEffect(() => {
    async function prefetchChat() {
      if (!chatId || !userId) return

      // Check if data already exists in cache
      const existingData = queryClient.getQueryData(['chat', chatId, userId])
      if (existingData) return

      // Prefetch the data
      await queryClient.prefetchQuery({
        queryKey: ['chat', chatId, userId] as const,
        queryFn: async () => {
          const response = await fetch(`/api/chats/${chatId}`, {
            headers: {
              'x-user-id': userId
            }
          })

          if (!response.ok) {
            // For 404, return empty chat data instead of throwing
            if (response.status === 404) {
              return {
                id: chatId,
                messages: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            }
            throw new Error('Failed to load chat')
          }

          return response.json()
        },
        staleTime: 1000 * 60 * 5 // 5 minutes
      })
    }

    prefetchChat()
  }, [chatId, userId, queryClient])

  return <Chat />
}
