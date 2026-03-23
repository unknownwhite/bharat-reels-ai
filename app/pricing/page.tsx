'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const plans = [
  {
    name: 'Starter',
    price: '₹299',
    limit: '20 videos / month'
  },
  {
    name: 'Creator',
    price: '₹799',
    limit: '80 videos / month'
  },
  {
    name: 'Pro',
    price: '₹1999',
    limit: '250 videos / month'
  }
]

export default function PricingPage() {

  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {

    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }

    getUser()

  }, [])

  const handlePlanSelect = (plan:any) => {

    if(!user){
      router.push('/signup')
      return
    }

    router.push(`/checkout?plan=${plan.name}`)

  }

  return (

    <div className="min-h-screen flex items-center justify-center px-6">

      <div className="max-w-6xl w-full grid md:grid-cols-3 gap-8">

        {plans.map((plan) => (

          <Card key={plan.name}>

            <CardContent className="p-8 text-center space-y-4">

              <h2 className="text-2xl font-bold">{plan.name}</h2>

              <p className="text-4xl font-bold">{plan.price}</p>

              <p className="text-muted-foreground">{plan.limit}</p>

              <Button
                className="w-full"
                onClick={()=>handlePlanSelect(plan)}
              >
                Choose Plan
              </Button>

            </CardContent>

          </Card>

        ))}

      </div>

    </div>

  )

}