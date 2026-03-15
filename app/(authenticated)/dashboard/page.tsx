import { PageHeader } from '@/components/page-header'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MOCK_QUEUE_ITEMS } from '@/lib/constants'
import { Zap, TrendingUp, Clock, Eye, ThumbsUp, Play, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function DashboardPage() {
  const stats = [
    {
      label: 'Videos Scheduled',
      value: '8',
      trend: { value: 12, direction: 'up' as const },
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: 'Published',
      value: '42',
      trend: { value: 8, direction: 'up' as const },
      icon: <Eye className="w-5 h-5" />,
    },
    {
      label: 'Videos Remaining',
      value: '85/100',
      trend: undefined,
      icon: <Zap className="w-5 h-5" />,
    },
    {
      label: 'Total Views',
      value: '98.5K',
      trend: { value: 24, direction: 'up' as const },
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ]

  const recentQueue = MOCK_QUEUE_ITEMS.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Dashboard"
          description="Welcome back! Here's your performance overview."
        />
        <Link href="/create">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Zap className="w-4 h-4 mr-2" />
            Create Video
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Trial Banner */}
      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Trial ends in 10 days</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Upgrade to Standard plan to get 100 videos/month and advanced features.
              </p>
            </div>
            <Link href="/billing">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Upgrade Now
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Queue */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Content Queue</CardTitle>
              <CardDescription>Latest videos and their status</CardDescription>
            </div>
            <Link href="/queue">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Platform</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Stats</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentQueue.map((item) => (
                  <TableRow key={item.id} className="border-border hover:bg-muted/50 transition">
                    <TableCell className="font-medium max-w-xs truncate">
                      {item.title}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {item.platform}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.scheduledTime
                        ? formatDistanceToNow(new Date(item.scheduledTime), { addSuffix: true })
                        : '—'}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        {item.views > 0 && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {item.views.toLocaleString()}
                          </span>
                        )}
                        {item.likes > 0 && (
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {item.likes.toLocaleString()}
                          </span>
                        )}
                        {item.views === 0 && item.likes === 0 && '—'}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.status === 'published' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {item.status === 'failed' && (
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
