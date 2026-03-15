'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import {
  ArrowRight,
  Zap,
  Sparkles,
  TrendingUp,
  Tv,
  Clock
} from 'lucide-react'

export default function LandingPage() {

  const [user, setUser] = useState<any>(null)

  useEffect(() => {

    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  return (

    <div className="min-h-screen bg-background">

      {/* Navigation */}

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>

            <span className="text-xl font-bold text-foreground">
              Bharat Reels AI
            </span>

          </div>

          <nav className="hidden md:flex items-center gap-8">

            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Features
            </a>

            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Pricing
            </a>

            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition">
              FAQ
            </a>

          </nav>

          <div className="flex items-center gap-3">

            {user ? (

              <>
                <span className="text-sm text-muted-foreground">
                  Welcome {user.user_metadata?.full_name
  ? user.user_metadata.full_name.charAt(0).toUpperCase() + user.user_metadata.full_name.slice(1)
  : user.email}
                </span>

                <Link href="/dashboard">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Dashboard
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>

            ) : (

              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                    Get Started
                  </Button>
                </Link>
              </>

            )}

          </div>

        </div>

      </header>


      {/* Hero Section */}

      <section className="relative overflow-hidden pt-20 pb-32 px-4 md:px-6">

        <div className="max-w-4xl mx-auto text-center space-y-8">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-sm text-purple-400">Powered by AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">

            Create YouTube Shorts in{' '}

            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              seconds
            </span>

          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">

            AI-powered content generation, smart scheduling, and analytics.
            Turn your ideas into viral YouTube Shorts without the hassle.

          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">

            <Link href="/signup">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 group">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
              </Button>
            </Link>

            <Link href="/login">
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </Link>

          </div>

        </div>

      </section>


      {/* Features */}

      <section id="features" className="py-20 px-4 md:px-6 bg-muted/30">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How it works
            </h2>

            <p className="text-lg text-muted-foreground">
              Three simple steps to grow your YouTube channel
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: 'Generate with AI',
                description: 'Enter a topic and let AI create engaging hooks and scripts'
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Smart Schedule',
                description: 'Pick optimal posting times and let the system publish automatically'
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Grow Faster',
                description: 'Track performance and optimize your content strategy'
              }
            ].map((feature, idx) => (

              <Card key={idx} className="border-border bg-card/50 backdrop-blur">

                <CardContent className="pt-8 space-y-4">

                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                    {feature.icon}
                  </div>

                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>

                </CardContent>

              </Card>

            ))}

          </div>

        </div>

      </section>


      {/* Footer */}

      <footer className="border-t border-border bg-card/50 backdrop-blur py-12 px-4 md:px-6">

        <div className="max-w-6xl mx-auto text-center">

          <p className="text-sm text-muted-foreground">
            © 2026 Bharat Reels AI. All rights reserved.
          </p>

        </div>

      </footer>

    </div>

  )

}