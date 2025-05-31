import { CheckIcon, CopyIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useCopy } from '@/hooks/use-copy'
import { cn } from '@/lib/utils'

interface CopyButtonProps {
  text: string
  className?: string
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const { copied, copy } = useCopy()

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('gap-1.5 opacity-0 transition-opacity group-hover/message:opacity-100', className)}
      onClick={() => copy(text)}
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <CheckIcon className="h-4 w-4" />
          <span className="text-xs">{'Copied!'}</span>
        </>
      ) : (
        <>
          <CopyIcon className="h-4 w-4" />
          <span className="text-xs">{'Copy'}</span>
        </>
      )}
    </Button>
  )
}
