import { cn } from '@/lib/utils'
import { STATUS_COLORS } from '@/lib/constants'
import type { VideoStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: VideoStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = STATUS_COLORS[status]
  const label = status.charAt(0).toUpperCase() + status.slice(1)

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        colors.badge,
        className
      )}
    >
      {label}
    </span>
  )
}
