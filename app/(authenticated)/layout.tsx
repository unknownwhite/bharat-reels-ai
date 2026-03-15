import { Sidebar } from '@/components/sidebar'
import { TopBar } from '@/components/top-bar'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-64">
        <TopBar />
        <main className="p-6 md:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  )
}
