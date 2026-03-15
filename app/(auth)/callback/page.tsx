import { Suspense } from "react"
import AuthCallbackClient from "./AuthCallbackClient"

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">
      <p>Verifying your account...</p>
    </div>}>
      <AuthCallbackClient />
    </Suspense>
  )
}