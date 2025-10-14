"use client"

import { LogoSphere } from "@/components/logo-sphere"
import { Card } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-8 py-8">
        <div className="flex items-center gap-4 mb-12">
          <LogoSphere />
          <h1 className="text-2xl font-bold tracking-tight">MerchBase</h1>
        </div>

        <div className="max-w-2xl mb-8">
          <h2 className="text-5xl font-bold leading-tight mb-8">
            We are a research and product studio for print on demand sellers. Quality, ethics, and community are our
            core values.
          </h2>
        </div>

        <nav className="flex flex-col gap-2 text-lg">
          <Link href="#" className="hover:opacity-70 transition-opacity">
            Sign in
          </Link>
          <Link href="#" className="hover:opacity-70 transition-opacity">
            Create account
          </Link>
          <Link href="#" className="hover:opacity-70 transition-opacity">
            About
          </Link>
        </nav>
      </header>

      {/* Product Grid */}
      <main className="px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
          {/* RankWrangler Card */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 border-0 p-8 min-h-[500px] flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-transform">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="bg-white rounded-2xl p-3 w-16 h-16 flex items-center justify-center">
                  <div className="text-3xl font-bold text-blue-600">R</div>
                </div>
                <ArrowUpRight className="w-6 h-6 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">RankWrangler</h3>
              <p className="text-sm text-white/80 mb-6">2025</p>
            </div>

            <div>
              <p className="text-white/90 leading-relaxed mb-4">
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

          {/* Placeholder cards for future tools */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200 border-0 p-8 min-h-[500px] flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-transform">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="bg-white rounded-2xl p-3 w-16 h-16 flex items-center justify-center">
                  <div className="text-3xl">🎨</div>
                </div>
                <ArrowUpRight className="w-6 h-6 text-gray-700 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Coming Soon</h3>
              <p className="text-sm text-gray-600 mb-6">2025</p>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed">
                More tools for print on demand sellers are in development. Stay tuned for announcements.
              </p>
            </div>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 border-0 p-8 min-h-[500px] flex flex-col justify-between group cursor-pointer hover:scale-[1.02] transition-transform">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="bg-white rounded-2xl p-3 w-16 h-16 flex items-center justify-center">
                  <div className="text-3xl">🚀</div>
                </div>
                <ArrowUpRight className="w-6 h-6 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Coming Soon</h3>
              <p className="text-sm text-white/80 mb-6">2025</p>
            </div>

            <div>
              <p className="text-white/90 leading-relaxed">
                Building the future of ethical and sustainable print on demand commerce.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
