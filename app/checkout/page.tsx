// app/checkout/page.tsx
import { Suspense } from 'react'
import CheckoutClient from '@/components/CheckoutClient'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutClient />
    </Suspense>
  )
}