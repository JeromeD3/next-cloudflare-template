'use client'

import equal from 'fast-deep-equal'
import { ChevronDownIcon, ChevronUpIcon, LightbulbIcon } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'

import { CopyButton } from '@/components/chat/copy-button'
import { cn } from '@/lib/utils'

import { SpinnerIcon } from './icons'
import { Markdown } from './markdown'
import { ToolInvocation } from './tool-invocation'

import type { Message as TMessage } from 'ai'

interface ReasoningPart {
  type: 'reasoning'
  reasoning: string
  details: Array<{ type: 'text'; text: string }>
}

interface ReasoningMessagePartProps {
  part: ReasoningPart
  isReasoning: boolean
}

export function ReasoningMessagePart({ part, isReasoning }: ReasoningMessagePartProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const memoizedSetIsExpanded = useCallback((value: boolean) => {
    setIsExpanded(value)
  }, [])

  useEffect(() => {
    memoizedSetIsExpanded(isReasoning)
  }, [isReasoning, memoizedSetIsExpanded])

  return (
    <div className="group mb-2 flex flex-col">
      {isReasoning ? (
        <div
          className={cn(
            'flex items-center gap-2.5 rounded-full px-3 py-1.5',
            'bg-indigo-50/50 text-indigo-700 dark:bg-indigo-900/10 dark:text-indigo-300',
            'w-fit border border-indigo-200/50 dark:border-indigo-700/20'
          )}
        >
          <div className="h-3.5 w-3.5 animate-spin">
            <SpinnerIcon />
          </div>
          <div className="text-xs font-medium tracking-tight">{'Thinking...'}</div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'flex w-full items-center justify-between',
            'mb-0.5 rounded-md px-3 py-2',
            'bg-muted/50 border-border/60 hover:border-border/80 border',
            'cursor-pointer transition-all duration-150',
            isExpanded ? 'bg-muted border-primary/20' : ''
          )}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full',
                'bg-amber-50 dark:bg-amber-900/20',
                'text-amber-600 ring-1 ring-amber-200 dark:text-amber-400 dark:ring-amber-700/30'
              )}
            >
              <LightbulbIcon className="h-3.5 w-3.5" />
            </div>
            <div className="text-foreground flex items-center gap-1.5 text-sm font-medium">
              {'Reasoning'}
              <span className="text-muted-foreground text-xs font-normal">
                {' (click to ' + (isExpanded ? 'hide' : 'view') + ')'}
              </span>
            </div>
          </div>
          <div
            className={cn(
              'flex items-center justify-center',
              'h-5 w-5 rounded-full p-0.5',
              'text-muted-foreground hover:text-foreground',
              'bg-background/80 border-border/50 border',
              'transition-colors'
            )}
          >
            {isExpanded ? <ChevronDownIcon className="h-3 w-3" /> : <ChevronUpIcon className="h-3 w-3" />}
          </div>
        </button>
      )}

      {isExpanded && (
        <div
          className={cn(
            'text-muted-foreground flex flex-col gap-2 text-sm',
            'mt-1 ml-0.5 pl-3.5',
            'border-l border-amber-200/50 dark:border-amber-700/30'
          )}
        >
          <div className="text-muted-foreground/70 pl-1 text-xs font-medium">{"The assistant's thought process:"}</div>
          {part.details.map((detail, detailIndex) =>
            detail.type === 'text' ? (
              <div key={detailIndex} className="bg-muted/10 border-border/30 rounded-md border px-2 py-1.5">
                <Markdown>{detail.text}</Markdown>
              </div>
            ) : (
              '<redacted>'
            )
          )}
        </div>
      )}
    </div>
  )
}

const PurePreviewMessage = ({
  message,
  isLatestMessage,
  status
}: {
  message: TMessage
  isLoading: boolean
  status: 'error' | 'submitted' | 'streaming' | 'ready'
  isLatestMessage: boolean
}) => {
  // Create a string with all text parts for copy functionality
  const getMessageText = () => {
    if (!message.parts) return ''
    return message.parts
      .filter((part) => part.type === 'text')
      .map((part) => (part.type === 'text' ? part.text : ''))
      .join('\n\n')
  }

  // Only show copy button if the message is from the assistant and not currently streaming
  const shouldShowCopyButton = message.role === 'assistant' && (!isLatestMessage || status !== 'streaming')

  return (
    <div
      className={cn('group/message mx-auto w-full px-4', message.role === 'assistant' ? 'mb-8' : 'mb-6')}
      data-role={message.role}
    >
      <div
        className={cn(
          'flex w-full gap-4 group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl',
          'group-data-[role=user]/message:w-fit'
        )}
      >
        <div className="flex w-full flex-col space-y-3">
          {message.parts?.map((part, i) => {
            switch (part.type) {
              case 'text':
                return (
                  <div key={`message-${message.id}-part-${i}`} className="flex w-full flex-row items-start gap-2">
                    <div
                      className={cn('flex w-full flex-col gap-3', {
                        'bg-secondary text-secondary-foreground rounded-2xl px-4 py-3': message.role === 'user'
                      })}
                    >
                      <Markdown>{part.text}</Markdown>
                    </div>
                  </div>
                )
              case 'tool-invocation':
                const { toolName, state, args } = part.toolInvocation
                const result = 'result' in part.toolInvocation ? part.toolInvocation.result : null

                return (
                  <ToolInvocation
                    key={`message-${message.id}-part-${i}`}
                    toolName={toolName}
                    state={state}
                    args={args}
                    result={result}
                    isLatestMessage={isLatestMessage}
                    status={status}
                  />
                )
              case 'reasoning':
                return (
                  <ReasoningMessagePart
                    key={`message-${message.id}-${i}`}
                    // @ts-expect-error part
                    part={part}
                    isReasoning={(message.parts && status === 'streaming' && i === message.parts.length - 1) ?? false}
                  />
                )
              default:
                return null
            }
          })}
          {shouldShowCopyButton && (
            <div className="mt-2 flex justify-start">
              <CopyButton text={getMessageText()} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Message = memo(PurePreviewMessage, (prevProps, nextProps) => {
  if (prevProps.status !== nextProps.status) return false
  if (prevProps.isLoading !== nextProps.isLoading) return false
  if (prevProps.isLatestMessage !== nextProps.isLatestMessage) return false
  if (prevProps.message.annotations !== nextProps.message.annotations) return false
  if (prevProps.message.id !== nextProps.message.id) return false
  if (!equal(prevProps.message.parts, nextProps.message.parts)) return false
  return true
})
