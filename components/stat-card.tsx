import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
  className?: string
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('border-border', className)}>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-medium">{label}</p>
            {icon && <div className="text-muted-foreground">{icon}</div>}
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            {trend && (
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.direction === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}
              >
                {trend.direction === 'up' ? '+' : '-'}{trend.value}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
