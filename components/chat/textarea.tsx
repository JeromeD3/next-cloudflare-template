import { ArrowUp, Loader2 } from 'lucide-react'

import { modelID } from '@/actions/ai-providers'
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'

interface InputProps {
  input: string
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
  status: string
  stop: () => void
  selectedModel: modelID
  setSelectedModel: (model: modelID) => void
}

export const Textarea = ({
  input,
  handleInputChange,
  isLoading,
  status,
  stop,
  selectedModel,
  setSelectedModel
}: InputProps) => {
  const isStreaming = status === 'streaming' || status === 'submitted'

  return (
    <div className="relative w-full">
      <ShadcnTextarea
        className="bg-background/50 dark:bg-muted/50 placeholder:text-muted-foreground w-full resize-none rounded-2xl border-0 pt-4 pr-12 pb-16 !ring-0 backdrop-blur-sm"
        value={input}
        autoFocus
        placeholder="Send a message..."
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !isLoading && input.trim()) {
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
      />
      {/* <ModelPicker setSelectedModel={setSelectedModel} selectedModel={selectedModel} /> */}

      <button
        type={isStreaming ? 'button' : 'submit'}
        onClick={isStreaming ? stop : undefined}
        disabled={(!isStreaming && !input.trim()) || (isStreaming && status === 'submitted')}
        className="bg-primary hover:bg-primary/90 disabled:bg-muted absolute right-2 bottom-2 rounded-full p-2 transition-all duration-200 disabled:cursor-not-allowed"
      >
        {isStreaming ? (
          <Loader2 className="text-primary-foreground h-4 w-4 animate-spin" />
        ) : (
          <ArrowUp className="text-primary-foreground h-4 w-4" />
        )}
      </button>
    </div>
  )
}
