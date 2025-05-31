'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquare, PlusCircle, Trash2, ChevronsUpDown, LogOut } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

import LoginModal from '@/components/login/login-modal2'
import Logo from '@/components/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { useChats } from '@/hooks/use-chats'
import { useRouter, usePathname, Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

export function ChatSidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const session = useSession()
  const user = session.data?.user
  const userId = user?.id ?? ''

  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  const { chats, isLoading, deleteChat } = useChats(userId)

  const handleNewChat = () => {
    router.push('/')
  }

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    deleteChat(chatId)

    if (pathname === `/chat/${chatId}`) {
      router.push('/')
    }
  }

  const renderChatSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <SidebarMenuItem key={`skeleton-${index}`}>
          <div className={`flex items-center gap-2 px-3 py-2 ${isCollapsed ? 'justify-center' : ''}`}>
            <Skeleton className="h-4 w-4 rounded-full" />
            {!isCollapsed && (
              <>
                <Skeleton className="h-4 w-full max-w-[180px]" />
                <Skeleton className="ml-auto h-5 w-5 flex-shrink-0 rounded-md" />
              </>
            )}
          </div>
        </SidebarMenuItem>
      ))
  }

  return (
    <Sidebar className="bg-background/80 dark:bg-background/40 shadow-sm backdrop-blur-md" collapsible="icon">
      <Header isCollapsed={isCollapsed} />

      <SidebarContent className="flex h-[calc(100vh-8rem)] flex-col">
        <SidebarGroup className="min-h-0 flex-1">
          <SidebarGroupLabel
            className={cn(
              'text-muted-foreground/80 px-4 text-xs font-medium tracking-wider uppercase',
              isCollapsed ? 'sr-only' : ''
            )}
          >
            {'Chats'}
          </SidebarGroupLabel>
          <SidebarGroupContent className={cn('overflow-y-auto pt-1', isCollapsed ? 'overflow-x-hidden' : '')}>
            <SidebarMenu>
              {isLoading ? (
                renderChatSkeletons()
              ) : chats.length === 0 ? (
                <div className={`flex items-center justify-center py-3 ${isCollapsed ? '' : 'px-4'}`}>
                  {isCollapsed ? (
                    <div className="border-border/50 bg-background/50 flex h-6 w-6 items-center justify-center rounded-md border">
                      <MessageSquare className="text-muted-foreground h-3 w-3" />
                    </div>
                  ) : (
                    <div className="border-border/50 bg-background/50 flex w-full items-center gap-3 rounded-md border border-dashed px-3 py-2">
                      <MessageSquare className="text-muted-foreground h-4 w-4" />
                      <span className="text-muted-foreground text-xs font-normal">{'No conversations yet'}</span>
                    </div>
                  )}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {chats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={isCollapsed ? chat.title : undefined}
                          data-active={pathname === `/chat/${chat.id}`}
                          className={cn(
                            'hover:bg-primary/10 active:bg-primary/15 transition-all',
                            pathname === `/chat/${chat.id}` ? 'bg-secondary/60 hover:bg-secondary/60' : ''
                          )}
                        >
                          <Link href={`/chat/${chat.id}`} className="flex w-full items-center justify-between gap-1">
                            <div className="flex min-w-0 flex-1 items-center overflow-hidden pr-2">
                              <MessageSquare
                                className={cn(
                                  'h-4 w-4 flex-shrink-0',
                                  pathname === `/chat/${chat.id}` ? 'text-foreground' : 'text-muted-foreground'
                                )}
                              />
                              {!isCollapsed && (
                                <span
                                  className={cn(
                                    'ml-2 truncate text-sm',
                                    pathname === `/chat/${chat.id}`
                                      ? 'text-foreground font-medium'
                                      : 'text-foreground/80'
                                  )}
                                  title={chat.title}
                                >
                                  {chat.title.length > 18 ? `${chat.title.slice(0, 18)}...` : chat.title}
                                </span>
                              )}
                            </div>
                            {!isCollapsed && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-foreground h-6 w-6 flex-shrink-0"
                                onClick={(e) => handleDeleteChat(chat.id, e)}
                                title="Delete chat"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-border/40 mt-auto border-t p-4">
        <div className={`flex flex-col ${isCollapsed ? 'items-center' : ''} gap-3`}>
          <Button
            variant="default"
            className={cn(
              'bg-primary-foreground text-primary hover:bg-primary-foreground/90 w-full',
              isCollapsed ? 'h-8 w-8 p-0' : ''
            )}
            onClick={handleNewChat}
            title={isCollapsed ? 'New Chat' : undefined}
          >
            <PlusCircle className={`${isCollapsed ? '' : 'mr-2'} h-4 w-4`} />
            {!isCollapsed && <span>{'New Chat'}</span>}
          </Button>

          {!userId ? (
            <LoginModal isCollapsed={isCollapsed} />
          ) : (
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                {isCollapsed ? (
                  <Button variant="ghost" className="flex h-8 w-8 items-center justify-center p-0">
                    <Avatar className="bg-secondary/60 h-6 w-6 rounded-lg">
                      <AvatarImage src={user?.image ?? ''} alt="logo" />
                      <AvatarFallback>{'logo'}</AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="border-border/60 hover:bg-secondary/50 h-10 w-full justify-between border bg-transparent px-2 font-normal shadow-none"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="bg-secondary/60 h-7 w-7 rounded-lg">
                        <AvatarImage src={user?.image ?? ''} alt="logo" />
                        <AvatarFallback>{user?.name?.[0] ?? ''}</AvatarFallback>
                      </Avatar>
                      <div className="grid text-left text-sm leading-tight">
                        <span className="text-foreground/90 truncate font-medium">{user?.name}</span>
                        <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                    <ChevronsUpDown className="text-muted-foreground h-4 w-4" />
                  </Button>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isCollapsed ? 'top' : 'top'}
                align={isCollapsed ? 'start' : 'end'}
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="bg-secondary/60 h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.image ?? ''} alt="logo" />
                      <AvatarFallback>{user?.name?.[0] ?? ''}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="text-foreground/90 truncate font-semibold">{user?.name}</span>
                      <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{'Log out'}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

const Header = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <SidebarHeader className="border-border/40 border-b p-3.5">
      <div className="flex items-center justify-start">
        <div className={`flex items-center gap-2 ${isCollapsed ? 'w-full justify-center' : ''}`}>
          <Logo withOutText={isCollapsed} />
        </div>
      </div>
    </SidebarHeader>
  )
}
