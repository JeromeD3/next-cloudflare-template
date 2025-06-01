import { createDeepSeek } from '@ai-sdk/deepseek'
import { customProvider } from 'ai'

const deepseekClient = createDeepSeek({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY
})

const languageModels = {
  deepseek: deepseekClient('deepseek/deepseek-r1-0528-qwen3-8b:free')
}

export const model = customProvider({
  languageModels
})
export type modelID = keyof typeof languageModels
export const defaultModel: modelID = 'deepseek'
export const MODELS = Object.keys(languageModels)

export interface ModelInfo {
  provider: string
  name: string
  description: string
  apiVersion: string
  capabilities: string[]
}

export const modelDetails: Record<keyof typeof languageModels, ModelInfo> = {
  deepseek: {
    provider: 'DeepSeek',
    name: 'DeepSeek R1-0528',
    description: "DeepSeek's R1-0528-Qwen3-8B with good balance of capabilities, including vision.",
    apiVersion: 'deepseek-ai/DeepSeek-R1-0528-Qwen3-8B',
    capabilities: ['Efficient', 'Agentic']
  }
}
