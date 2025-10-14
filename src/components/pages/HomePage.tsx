import { ArrowUpRight } from 'lucide-react'

import { LogoSphere } from '@/components/LogoSphere'
import { Card } from '@/components/ui/Card'

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="px-8 py-8">
        <div className="mb-12 flex items-center gap-4">
          <LogoSphere />
          <h1 className="text-2xl font-bold tracking-tight">MerchBase</h1>
        </div>

        <div className="mb-8 max-w-2xl">
          <h2 className="mb-8 text-5xl font-bold leading-tight">
            We are a research and product studio for print on demand sellers. Quality, ethics, and community are our
            core values.
          </h2>
        </div>

        <nav className="flex flex-col gap-2 text-lg">
          <a href="#" className="transition-opacity hover:opacity-70">
            Sign in
          </a>
          <a href="#" className="transition-opacity hover:opacity-70">
            Create account
          </a>
          <a href="#" className="transition-opacity hover:opacity-70">
            About
          </a>
        </nav>
      </header>

      <main className="px-8 pb-16">
        <div className="grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group relative flex min-h-[500px] cursor-pointer flex-col justify-between overflow-hidden border-0 bg-gradient-to-br from-blue-400 to-blue-600 p-8 transition-transform hover:scale-[1.02]">
            <div>
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3">
                  <div className="text-3xl font-bold text-blue-600">R</div>
                </div>
                <ArrowUpRight className="h-6 w-6 text-white opacity-70 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-white">RankWrangler</h3>
              <p className="mb-6 text-sm text-white/80">2025</p>
            </div>

            <div>
              <p className="mb-4 leading-relaxed text-white/90">
                A powerful analytics and optimization tool for Amazon Merch on Demand sellers. It tracks product
                rankings, keyword performance, and ad results in real time—helping creators understand what's working,
                spot trends early, and outsmart the competition.
              </p>
              <p className="text-sm text-white/70">
                Designed for speed and clarity, RankWrangler turns raw data into easy-to-read dashboards that reveal
                exactly how your listings perform across keywords, categories, and campaigns.
              </p>
            </div>
          </Card>

          <Card className="group relative flex min-h-[500px] cursor-pointer flex-col justify-between overflow-hidden border-0 bg-gradient-to-br from-amber-100 to-amber-200 p-8 transition-transform hover:scale-[1.02]">
            <div>
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3">
                  <div className="text-3xl">🎨</div>
                </div>
                <ArrowUpRight className="h-6 w-6 text-gray-700 opacity-70 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-gray-900">Coming Soon</h3>
              <p className="mb-6 text-sm text-gray-600">2025</p>
            </div>

            <div>
              <p className="leading-relaxed text-gray-700">
                More tools for print on demand sellers are in development. Stay tuned for announcements.
              </p>
            </div>
          </Card>

          <Card className="group relative flex min-h-[500px] cursor-pointer flex-col justify-between overflow-hidden border-0 bg-gradient-to-br from-emerald-400 to-teal-500 p-8 transition-transform hover:scale-[1.02]">
            <div>
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3">
                  <div className="text-3xl">🚀</div>
                </div>
                <ArrowUpRight className="h-6 w-6 text-white opacity-70 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mb-2 text-3xl font-bold text-white">Coming Soon</h3>
              <p className="mb-6 text-sm text-white/80">2025</p>
            </div>

            <div>
              <p className="leading-relaxed text-white/90">Building the future of ethical and sustainable print on demand commerce.</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
