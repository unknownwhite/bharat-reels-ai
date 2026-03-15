'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

import { Zap, Check } from 'lucide-react'

export default function SignupPage() {

  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault()

    setIsLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'http://localhost:3000/callback',
        data: {
          full_name: name
        }
      }
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setEmailSent(true)
  }

  const handleGoogleSignup = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }

  // EMAIL VERIFICATION SCREEN
  if (emailSent) {
    return (
      <div className="w-full max-w-md text-center space-y-6">

        <h1 className="text-2xl font-bold">Check your email</h1>

        <p className="text-muted-foreground">
          We sent a verification link to
        </p>

        <p className="font-semibold">{email}</p>

        <p className="text-sm text-muted-foreground">
          Click the link in your email to activate your account.
        </p>

        <Link
          href="/login"
          className="text-purple-500 font-medium"
        >
          Go to Login
        </Link>

      </div>
    )
  }

  return (

    <div className="w-full max-w-md space-y-8">

      <div className="flex flex-col items-center gap-4">

        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">
            Bharat Reels AI
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Create your account and start creating
          </p>
        </div>

      </div>

      <Card>

        <CardHeader>

          <CardTitle>Get started free</CardTitle>

          <CardDescription>
            14-day trial. No credit card required.
          </CardDescription>

        </CardHeader>

        <CardContent className="space-y-4">

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Full Name
              </label>

              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

            </div>

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Email
              </label>

              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

            </div>

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Password
              </label>

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

            </div>

            <div className="flex items-start gap-3 pt-2">

              <Checkbox required className="mt-1" />

              <span className="text-sm text-muted-foreground">
                I agree to the Terms of Service and Privacy Policy
              </span>

            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >

              {isLoading ? 'Creating account...' : 'Create Account'}

            </Button>

          </form>

          <div className="relative">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">

              <span className="bg-card px-2 text-muted-foreground">
                Or sign up with
              </span>

            </div>

          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignup}
          >
            Continue with Google
          </Button>

          <div className="bg-muted/50 rounded-lg p-4 space-y-3 border border-border">

            <p className="text-sm font-semibold text-foreground">
              Free Trial Includes:
            </p>

            <ul className="space-y-2 text-sm text-muted-foreground">

              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                20 videos per month
              </li>

              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                AI-powered content generation
              </li>

              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                YouTube account connection
              </li>

              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Basic analytics
              </li>

            </ul>

          </div>

        </CardContent>

      </Card>

      <div className="text-center">

        <p className="text-sm text-muted-foreground">

          Already have an account?{' '}

          <Link
            href="/login"
            className="text-purple-500 hover:text-purple-400 font-medium"
          >
            Sign in
          </Link>

        </p>

      </div>

    </div>

  )
}