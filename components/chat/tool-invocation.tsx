'use client'

import {
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2,
  CheckCircle2,
  TerminalSquare,
  Code,
  ArrowRight,
  Circle
} from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

interface ToolInvocationProps {
  toolName: string
  state: string
  args: any
  result: any
  isLatestMessage: boolean
  status: string
}

export function ToolInvocation({ toolName, state, args, result, isLatestMessage, status }: ToolInvocationProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusIcon = () => {
    if (state === 'call') {
      if (isLatestMessage && status !== 'ready') {
        return <Loader2 className="text-primary/70 h-3.5 w-3.5 animate-spin" />
      }
      return <Circle className="fill-muted-foreground/10 text-muted-foreground/70 h-3.5 w-3.5" />
    }
    return <CheckCircle2 size={14} className="text-primary/90" />
  }

  const getStatusClass = () => {
    if (state === 'call') {
      if (isLatestMessage && status !== 'ready') {
        return 'text-primary'
      }
      return 'text-muted-foreground'
    }
    return 'text-primary'
  }

  const formatContent = (content: any): string => {
    try {
      if (typeof content === 'string') {
        try {
          const parsed = JSON.parse(content)
          return JSON.stringify(parsed, null, 2)
        } catch {
          return content
        }
      }
      return JSON.stringify(content, null, 2)
    } catch {
      return String(content)
    }
  }

  return (
    <div
      className={cn(
        'border-border/50 mb-2 flex flex-col overflow-hidden rounded-md border',
        'from-background to-muted/30 bg-gradient-to-b backdrop-blur-sm',
        'hover:border-border/80 group transition-all duration-200'
      )}
    >
      <div
        className={cn('flex cursor-pointer items-center gap-2.5 px-3 py-2 transition-colors', 'hover:bg-muted/20')}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="bg-primary/5 text-primary flex h-5 w-5 items-center justify-center rounded-full">
          <TerminalSquare className="h-3.5 w-3.5" />
        </div>
        <div className="text-muted-foreground flex flex-1 items-center gap-1.5 text-xs font-medium">
          <span className="text-foreground font-semibold tracking-tight">{toolName}</span>
          <ArrowRight className="text-muted-foreground/50 h-3 w-3" />
          <span className={cn('font-medium', getStatusClass())}>
            {state === 'call' ? (isLatestMessage && status !== 'ready' ? 'Running' : 'Waiting') : 'Completed'}
          </span>
        </div>
        <div className="flex items-center gap-2 opacity-70 transition-opacity group-hover:opacity-100">
          {getStatusIcon()}
          <div className="bg-muted/30 border-border/30 rounded-full border p-0.5">
            {isExpanded ? (
              <ChevronUpIcon className="text-foreground/70 h-3 w-3" />
            ) : (
              <ChevronDownIcon className="text-foreground/70 h-3 w-3" />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-2 px-3 pb-3">
          {!!args && (
            <div className="space-y-1.5">
              <div className="text-muted-foreground/70 flex items-center gap-1.5 pt-1.5 text-xs">
                <Code className="h-3 w-3" />
                <span className="font-medium">{'Arguments'}</span>
              </div>
              <pre
                className={cn(
                  'overflow-x-auto rounded-md p-2.5 font-mono text-xs',
                  'border-border/40 bg-muted/10 border'
                )}
              >
                {formatContent(args)}
              </pre>
            </div>
          )}

          {!!result && (
            <div className="space-y-1.5">
              <div className="text-muted-foreground/70 flex items-center gap-1.5 text-xs">
                <ArrowRight className="h-3 w-3" />
                <span className="font-medium">{'Result'}</span>
              </div>
              <pre
                className={cn(
                  'max-h-[300px] overflow-x-auto overflow-y-auto rounded-md p-2.5 font-mono text-xs',
                  'border-border/40 bg-muted/10 border'
                )}
              >
                {formatContent(result)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
