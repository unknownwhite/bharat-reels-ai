'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'

export default function LoginPage() {

  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.refresh()
router.push('/')

  }

  const handleGoogleLogin = async () => {

    await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${location.origin}/dashboard`
  }
})

  }

  return (
    <div className="w-full max-w-md space-y-8">

      <div className="flex flex-col items-center gap-4">

        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Bharat Reels AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

      </div>

      <Card className="border-border">

        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Enter your credentials to sign in</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">

              <label className="text-sm font-medium text-foreground">
                Email
              </label>

              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-muted border-border"
              />

            </div>

            <div className="space-y-2">

              <label className="text-sm font-medium text-foreground">
                Password
              </label>

              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-muted border-border"
              />

            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >

              {isLoading ? 'Signing in...' : 'Sign In'}

            </Button>

          </form>

          <div className="relative">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>

          </div>

          <Button
            variant="outline"
            className="w-full border-border"
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>

        </CardContent>

      </Card>

      <div className="text-center space-y-2">

        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link href="/signup" className="text-purple-500 hover:text-purple-400 font-medium">
            Sign up
          </Link>
        </p>

        <p className="text-sm text-muted-foreground">
          <a href="#" className="text-purple-500 hover:text-purple-400">
            Forgot password?
          </a>
        </p>

      </div>

    </div>
  )
}