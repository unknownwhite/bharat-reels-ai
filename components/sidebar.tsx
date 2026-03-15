'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { NAV_ITEMS } from '@/lib/constants'
import {
  LayoutDashboard,
  Plus,
  ListVideo,
  Users,
  CreditCard,
  Settings,
  Zap,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Plus: <Plus className="w-5 h-5" />,
  ListVideo: <ListVideo className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r border-border bg-card fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Bharat Reels</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              {ICON_MAP[item.icon]}
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-3">
        <div className="text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Need help?</p>
          <p>Check our documentation or contact support.</p>
        </div>
        <button className="w-full px-4 py-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          Contact Support
        </button>
      </div>
    </aside>
  )
}
