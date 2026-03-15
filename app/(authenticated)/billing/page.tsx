import { PageHeader } from '@/components/page-header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/constants'

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription and upgrade your plan"
      />

      {/* Current Plan */}
      <Card className="border-border border-purple-500/30 bg-purple-500/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Current Plan</CardTitle>
              <CardDescription className="mt-1">Standard Plan • Renews on March 15, 2024</CardDescription>
            </div>
            <Badge className="bg-purple-600 text-white text-base px-4 py-1">Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Videos per Month</p>
              <p className="text-2xl font-bold text-foreground mt-1">15/100</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Connected Accounts</p>
              <p className="text-2xl font-bold text-foreground mt-1">1/5</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Monthly Price</p>
              <p className="text-2xl font-bold text-foreground mt-1">₹499</p>
            </div>
          </div>
          <Button variant="outline" className="border-border">
            Manage Subscription
          </Button>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Choose Your Plan</h2>
        <p className="text-muted-foreground">
          Upgrade or downgrade your plan anytime. Changes take effect immediately.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`border-border relative transition ${
                plan.popular ? 'md:scale-105 border-purple-500/50 shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <p className="text-4xl font-bold text-foreground">
                    {plan.currency}{plan.price}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{plan.period}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    {plan.videosPerMonth} videos per month
                  </p>
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.id === 'standard'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : ''
                  }`}
                  variant={plan.id === 'standard' ? 'default' : 'outline'}
                >
                  {plan.id === 'standard' ? 'Current Plan' : plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>Your recent invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                date: 'Feb 15, 2024',
                plan: 'Standard Plan',
                amount: '₹499',
                status: 'Paid',
              },
              {
                date: 'Jan 15, 2024',
                plan: 'Standard Plan',
                amount: '₹499',
                status: 'Paid',
              },
              {
                date: 'Dec 15, 2023',
                plan: 'Basic Plan',
                amount: '₹249',
                status: 'Paid',
              },
            ].map((invoice, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{invoice.plan}</p>
                  <p className="text-sm text-muted-foreground">{invoice.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-foreground">{invoice.amount}</p>
                  <Badge variant="outline" className="border-green-500/30 text-green-600 dark:text-green-400">
                    {invoice.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              q: 'Can I change my plan anytime?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
            },
            {
              q: 'What happens when I reach my video limit?',
              a: 'You\'ll receive a notification. You can upgrade your plan to continue creating videos.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes, all new users get a 14-day free trial with 20 videos per month on the Basic plan.',
            },
            {
              q: 'Can I get a refund?',
              a: 'We offer a 7-day money-back guarantee for new subscriptions. Contact support for details.',
            },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <p className="font-semibold text-foreground">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
