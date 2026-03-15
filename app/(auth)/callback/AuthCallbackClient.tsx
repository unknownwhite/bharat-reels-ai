'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackClient() {

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {

    const handleAuth = async () => {

      const code = searchParams.get('code')

      if (!code) {
        router.push('/login')
        return
      }

      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Auth error:', error.message)
        router.push('/login')
        return
      }

      router.push('/dashboard')

    }

    handleAuth()

  }, [router, searchParams])

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Verifying your account...</p>
    </div>
  )
}