import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-2xl">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      {/* Profile Settings */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Full Name
            </Label>
            <Input
              id="name"
              defaultValue="Rahul Chaudhari"
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="Rahul@example.com"
              className="bg-muted border-border"
            />
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            {
              title: 'Email Notifications',
              description: 'Receive updates about your videos and account',
              enabled: true,
            },
            {
              title: 'Upload Reminders',
              description: 'Get reminded when you haven\'t posted in a while',
              enabled: true,
            },
            {
              title: 'Performance Reports',
              description: 'Weekly summary of your video performance',
              enabled: false,
            },
            {
              title: 'Promotional Emails',
              description: 'News about new features and special offers',
              enabled: false,
            },
          ].map((notif, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground">{notif.title}</p>
                <p className="text-sm text-muted-foreground">{notif.description}</p>
              </div>
              <Switch defaultChecked={notif.enabled} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Manage your API keys for integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-mono text-muted-foreground">
                sk_test_51234567890abcdef...
              </p>
              <Button variant="outline" size="sm" className="border-border">
                Copy
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Created 3 months ago</p>
          </div>
          <Button variant="outline" className="border-border">
            + Generate New Key
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-foreground">Delete Account</h4>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data
            </p>
            <Button
              variant="outline"
              className="border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
