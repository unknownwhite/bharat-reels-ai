'use client'

import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function CheckoutPage() {

  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')

  const plans:any = {
    Starter: {
      price: '₹299',
      videos: '20 videos / month'
    },
    Creator: {
      price: '₹799',
      videos: '80 videos / month'
    },
    Pro: {
      price: '₹1999',
      videos: '250 videos / month'
    }
  }

  const selectedPlan = plans[plan as keyof typeof plans]

  if(!selectedPlan){
    return <div className="p-10 text-center">Invalid Plan</div>
  }

  return (

    <div className="min-h-screen flex items-center justify-center px-6">

      <Card className="max-w-md w-full">

        <CardContent className="p-8 text-center space-y-6">

          <h1 className="text-3xl font-bold">
            {plan} Plan
          </h1>

          <p className="text-4xl font-bold">
            {selectedPlan.price}
          </p>

          <p className="text-muted-foreground">
            {selectedPlan.videos}
          </p>

          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            Continue to Payment
          </Button>

        </CardContent>

      </Card>

    </div>

  )

}