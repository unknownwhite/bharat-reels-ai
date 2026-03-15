// Navigation items
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    label: 'Create Video',
    href: '/create',
    icon: 'Plus',
  },
  {
    label: 'My Queue',
    href: '/queue',
    icon: 'ListVideo',
  },
  {
    label: 'Accounts',
    href: '/accounts',
    icon: 'Users',
  },
  {
    label: 'Billing',
    href: '/billing',
    icon: 'CreditCard',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
  },
]

// Status color mapping
export const STATUS_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  queued: {
    bg: 'bg-slate-100 dark:bg-slate-900',
    text: 'text-slate-700 dark:text-slate-300',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
  },
  processing: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  },
  scheduled: {
    bg: 'bg-purple-100 dark:bg-purple-900/30',
    text: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  },
  published: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  },
  failed: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  },
}

// Pricing plans
export const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 249,
    currency: '₹',
    period: '/month',
    description: 'Perfect for getting started',
    videosPerMonth: 20,
    features: [
      'Up to 20 videos/month',
      '1 YouTube account',
      'Basic AI-generated hooks',
      'Standard processing',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 499,
    currency: '₹',
    period: '/month',
    description: 'Best for content creators',
    videosPerMonth: 100,
    features: [
      'Up to 100 videos/month',
      'Up to 5 YouTube accounts',
      'Advanced AI hooks & scripts',
      'Priority processing',
      'Email support',
      'Analytics dashboard',
      'Custom branding',
    ],
    cta: 'Try Free',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 999,
    currency: '₹',
    period: '/month',
    description: 'For professional studios',
    videosPerMonth: 500,
    features: [
      'Up to 500 videos/month',
      'Unlimited accounts',
      'Premium AI models',
      'Instant processing',
      'Dedicated support',
      'Advanced analytics',
      'API access',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

// Queue filters
export const QUEUE_FILTERS = [
  { id: 'all', label: 'All', count: 24 },
  { id: 'queued', label: 'Queued', count: 5 },
  { id: 'processing', label: 'Processing', count: 2 },
  { id: 'scheduled', label: 'Scheduled', count: 8 },
  { id: 'published', label: 'Published', count: 9 },
  { id: 'failed', label: 'Failed', count: 0 },
]

// Mock queue items
export const MOCK_QUEUE_ITEMS = [
  {
    id: '1',
    title: '5 Easy Ways to Make Money Online in 2024',
    status: 'published',
    platform: 'youtube',
    scheduledTime: '2024-02-15T14:30:00',
    views: 2340,
    likes: 156,
  },
  {
    id: '2',
    title: 'Top 10 Productivity Tips for Entrepreneurs',
    status: 'scheduled',
    platform: 'youtube',
    scheduledTime: '2024-02-20T10:00:00',
    views: 0,
    likes: 0,
  },
  {
    id: '3',
    title: 'How to Build a Personal Brand on Social Media',
    status: 'processing',
    platform: 'youtube',
    scheduledTime: null,
    views: 0,
    likes: 0,
  },
  {
    id: '4',
    title: 'Cryptocurrency Explained for Beginners',
    status: 'queued',
    platform: 'youtube',
    scheduledTime: null,
    views: 0,
    likes: 0,
  },
]
