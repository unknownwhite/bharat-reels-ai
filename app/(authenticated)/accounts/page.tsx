import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Youtube, TrendingUp, CheckCircle2, Lock, AlertCircle } from 'lucide-react'

export default function AccountsPage() {
  const accounts = [
    {
      id: 1,
      platform: 'youtube',
      name: 'Tech Channel',
      handle: '@techchannel',
      subscribers: 45200,
      connected: true,
      avatar: 'TC',
    },
    {
      id: 2,
      platform: 'tiktok',
      name: 'TikTok Account',
      handle: '@yourcreator',
      subscribers: 0,
      connected: false,
      avatar: 'TT',
    },
    {
      id: 3,
      platform: 'instagram',
      name: 'Instagram Profile',
      handle: '@yourcreator',
      subscribers: 0,
      connected: false,
      avatar: 'IG',
    },
    {
      id: 4,
      platform: 'facebook',
      name: 'Facebook Page',
      handle: 'Your Page',
      subscribers: 0,
      connected: false,
      avatar: 'FB',
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Connected Accounts"
        description="Manage your social media accounts and publishing permissions"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {accounts.map((account) => (
          <Card
            key={account.id}
            className={`border-border transition ${
              !account.connected ? 'opacity-60' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500">
                    <AvatarFallback className="text-white font-semibold">
                      {account.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <CardDescription className="mt-1">{account.handle}</CardDescription>
                  </div>
                </div>
                {account.connected && (
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {account.connected && account.subscribers > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  {account.subscribers.toLocaleString()} subscribers
                </div>
              )}

              {!account.connected && account.platform !== 'youtube' && (
                <div className="flex items-start gap-2 text-sm bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                  <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <p className="text-yellow-700 dark:text-yellow-400">Coming soon! Integration is in development.</p>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {account.connected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-border"
                    >
                      Manage
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border text-red-500"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <Button
                    className={`flex-1 ${
                      account.platform === 'youtube'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-muted text-muted-foreground cursor-not-allowed'
                    }`}
                    disabled={account.platform !== 'youtube'}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {account.platform === 'youtube' ? 'Connect' : 'Coming Soon'}
                  </Button>
                )}
              </div>

              {account.platform === 'youtube' && account.connected && (
                <div className="text-xs text-muted-foreground bg-muted/50 border border-border rounded-lg p-3 mt-3">
                  <p className="font-medium mb-1">Publishing Permissions:</p>
                  <ul className="space-y-1 space-x-1">
                    <li>✓ Upload videos</li>
                    <li>✓ Schedule publishing</li>
                    <li>✓ Access analytics</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Guide */}
      <Card className="border-border border-dashed">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-600" />
            YouTube Setup Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            To connect your YouTube channel, you'll authorize Bharat Reels to:
          </p>
          <ul className="space-y-2 ml-4">
            <li>• Upload videos to your channel</li>
            <li>• Schedule videos for publication</li>
            <li>• View your channel analytics</li>
          </ul>
          <p className="pt-2">
            Your credentials are secure and encrypted. You can revoke access anytime from your YouTube account settings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
