'use client'
import { Icon } from '@iconify-icon/react'
import { Loader2, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { toast } from 'sonner'

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
    resend: false
  })
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSignIn = async (provider: 'google' | 'resend') => {
    setIsLoading((prev) => ({ ...prev, [provider]: true }))
    setError(null)
    try {
      const result = await signIn(provider, {
        ...(provider === 'resend' ? { email } : {}),
        redirect: false
      })

      if (provider === 'resend') {
        toast(t('magicLinkSent'))
        setEmail('')
      }
      if (onSuccess) onSuccess()
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
    <div className="">
      <Button
        onClick={() => handleSignIn('google')}
        disabled={isLoading.google}
        variant="outline"
        className="bg-primary/90 hover:bg-primary w-full py-6"
      >
        {isLoading.google ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <Icon icon="dashicons:google" width="20" height="20"></Icon>
        )}
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
          className="w-full py-6"
          disabled={isLoading.resend}
        />
        <Button type="submit" disabled={isLoading.resend} variant="outline" className="w-full p-6">
          {isLoading.resend ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
          {t('signInWithEmail')}
        </Button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </form>
    </div>
  )
}
