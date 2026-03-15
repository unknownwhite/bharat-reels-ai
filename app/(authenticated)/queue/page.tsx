import { PageHeader } from '@/components/page-header'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { MOCK_QUEUE_ITEMS, QUEUE_FILTERS } from '@/lib/constants'
import { Eye, ThumbsUp, Play, Trash2, RotateCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function QueuePage() {
  const allItems = MOCK_QUEUE_ITEMS

  const getFilteredItems = (status: string) => {
    if (status === 'all') return allItems
    return allItems.filter((item) => item.status === status)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Queue"
        description="Manage and track all your scheduled and published videos"
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 border-b border-border bg-transparent p-0 h-auto">
          {QUEUE_FILTERS.map((filter) => (
            <TabsTrigger
              key={filter.id}
              value={filter.id}
              className="rounded-none border-b-2 border-transparent px-4 py-3 text-sm font-medium data-[state=active]:border-purple-500 data-[state=active]:text-purple-500"
            >
              {filter.label}
              <Badge variant="secondary" className="ml-2 text-xs">
                {filter.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {QUEUE_FILTERS.map((filter) => (
          <TabsContent key={filter.id} value={filter.id} className="space-y-4 mt-6">
            {getFilteredItems(filter.id).length > 0 ? (
              <div className="grid gap-4">
                {getFilteredItems(filter.id).map((item) => (
                  <Card key={item.id} className="border-border hover:border-purple-500/30 transition">
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground truncate">
                              {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.status === 'published' && item.scheduledTime
                                ? `Published ${formatDistanceToNow(new Date(item.scheduledTime), { addSuffix: true })}`
                                : item.scheduledTime
                                  ? `Scheduled for ${formatDistanceToNow(new Date(item.scheduledTime), { addSuffix: true })}`
                                  : 'Pending'}
                            </p>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize border-border">
                              {item.platform}
                            </Badge>
                          </div>

                          {item.views > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Eye className="w-4 h-4" />
                              {item.views.toLocaleString()} views
                            </div>
                          )}

                          {item.likes > 0 && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <ThumbsUp className="w-4 h-4" />
                              {item.likes.toLocaleString()} likes
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          {item.status === 'published' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              View Video
                            </Button>
                          )}
                          {item.status === 'failed' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border"
                              >
                                <RotateCw className="w-4 h-4 mr-2" />
                                Retry
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border text-red-500"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </Button>
                            </>
                          )}
                          {(item.status === 'queued' || item.status === 'scheduled') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border"
                            >
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border border-dashed">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">
                    No {filter.label.toLowerCase()} videos yet
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
