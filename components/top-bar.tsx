'use client'

import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NAV_ITEMS } from '@/lib/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function TopBar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card">
      <div className="flex items-center justify-between h-16 px-4 md:pl-[280px] md:pr-6">
        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b border-border flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
                <h1 className="text-lg font-bold">Bharat Reels</h1>
              </div>
              <nav className="px-4 py-6 space-y-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      )}
                    >
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Plan badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Standard Plan
            </span>
          </div>

          {/* Video counter */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border">
            <span className="text-sm font-medium text-foreground">85/100</span>
            <span className="text-xs text-muted-foreground">videos left</span>
          </div>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-4 py-3 space-y-1">
                <p className="text-sm font-semibold text-foreground">Rahul Chaudhari</p>
                <p className="text-xs text-muted-foreground">rahul@example.com</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Account</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
