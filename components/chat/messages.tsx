import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom'

import { Message } from './message'

import type { Message as TMessage } from 'ai'

export const Messages = ({
  messages,
  isLoading,
  status
}: {
  messages: TMessage[]
  isLoading: boolean
  status: 'error' | 'submitted' | 'streaming' | 'ready'
}) => {
  const [containerRef, endRef] = useScrollToBottom()

  return (
    <div className="no-scrollbar h-full overflow-y-auto" ref={containerRef}>
      <div className="mx-auto max-w-lg py-4 sm:max-w-3xl">
        {messages.map((m, i) => (
          <Message
            key={i}
            isLatestMessage={i === messages.length - 1}
            isLoading={isLoading}
            message={m}
            status={status}
          />
        ))}
        <div className="h-1" ref={endRef} />
      </div>
    </div>
  )
}
