'use client'

import { Loader2, LogIn, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface LoginFormProps {
  onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const t = useTranslations('login.form')

  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState({
    google: false,
    github: false,
    email: false
  })
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSignIn = async (provider: 'google' | 'resend') => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }))
    setError(null)
    setMessage(null)
    try {
      const result = await signIn(provider, {
        ...(provider === 'resend' ? { email } : {}),
        redirect: false
      })

      if (result?.ok && !result?.error) {
        if (provider === 'resend') {
          setMessage(t('magicLinkSent'))
          setEmail('')
        }
        if (onSuccess) onSuccess()
      } else {
        setError(result?.error || t('signInFailed'))
      }
    } catch (error) {
      setError(t('signInFailed'))
    } finally {
      setIsLoading((prev) => ({ ...prev, [provider]: false }))
    }
  }

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      setError(t('invalidEmail'))
      return
    }
    handleSignIn('resend')
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => handleSignIn('google')} disabled={isLoading.google} variant="outline" className="w-full">
        {isLoading.google ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
        {t('continueWithGoogle')}
      </Button>

      <div className="relative my-6 flex items-center">
        <div className="border-border flex-grow border-t"></div>
        <span className="text-muted-foreground mx-4 flex-shrink text-xs uppercase">{t('orContinueWith')}</span>
        <div className="border-border flex-grow border-t"></div>
      </div>

      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <Input
          type="email"
          placeholder={t('emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full"
          disabled={isLoading.email}
        />
        <Button type="submit" disabled={isLoading.email} variant="outline" className="w-full">
          {isLoading.email ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
          {t('signInWithEmail')}
        </Button>
        {message && <div className="text-sm text-green-600">{message}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
      </form>
    </div>
  )
}
