'use client'

import { ChartBar, LogOut, Settings } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { getUserAnalysisUsage } from '@/actions/userAnalysis'
import LoginForm from '@/components/login/login-form'
import Logo from '@/components/logo'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MAX_USAGE_COUNT } from '@/config/constants'
import { useIsMobile } from '@/hooks/use-mobile'
import { Link } from '@/i18n/navigation'

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false)
  const session = useSession()
  const data = session.data?.user
  const t = useTranslations('login')
  const site = useTranslations('siteInfo')
  const isMobile = useIsMobile()
  const isAdmin = process.env.NEXT_PUBLIC_ADMIN_ID.split(',').includes(data?.id ?? '')

  const [usageCount, setUsageCount] = useState(0)
  const fetchUsage = async (id: string) => {
    try {
      const count = await getUserAnalysisUsage(id)
      setUsageCount(count)
    } catch (error) {
      console.error('errorFetchingUsage', error)
    }
  }
  useEffect(() => {
    if (data?.id) {
      fetchUsage(data.id)
    }
  }, [data?.id])

  if (session.status === 'loading') return null

  if (session.status === 'authenticated') {
    if (isMobile) {
      return (
        <div className="border-border/40 flex items-center justify-between gap-3 border-b px-1 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session.data?.user?.image || ''} alt={session.data?.user?.name || 'User'} />
              <AvatarFallback>{session.data?.user?.name?.[0] || session.data?.user?.email?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              {session.data?.user?.name && <p className="truncate font-medium">{session.data.user.name}</p>}
              {session.data?.user?.email && (
                <p className="text-muted-foreground truncate text-xs">{session.data.user.email}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut()}
            className="text-muted-foreground hover:text-destructive h-8 w-8"
            title={t('signOut')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full p-0">
            <Avatar className="h-8 w-8">
              <AvatarImage src={session.data?.user?.image || ''} alt={session.data?.user?.name || 'User'} />
              <AvatarFallback>{session.data?.user?.name?.[0] || session.data?.user?.email?.[0] || '?'}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              {session.data?.user?.name && <p className="font-medium">{session.data.user.name}</p>}
              {session.data?.user?.email && (
                <p className="text-muted-foreground truncate text-xs">{session.data.user.email}</p>
              )}
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-muted-foreground flex items-center gap-2 text-xs">
            <ChartBar className="mr-2 h-4 w-4" />
            <span>{`${usageCount} / ${MAX_USAGE_COUNT} Free usage`}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isAdmin && (
            <>
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                <Link href="/admin/articles" className="flex items-center gap-2">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>{'Dashboard'}</span>
                </Link>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('signOut')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{t('login')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="mx-auto text-2xl font-bold">
            <Logo></Logo>
          </DialogTitle>
          <DialogDescription className="text-center">{t('modal.description')}</DialogDescription>
        </DialogHeader>
        <LoginForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
