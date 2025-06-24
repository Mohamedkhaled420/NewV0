"use client"

import dynamic from "next/dynamic"
import LiquidGlassCard from "@/components/LiquidGlassCard"
import { LiquidGlassButton } from "@/components/ui/LiquidGlassButton"
import { Suspense } from "react"

// Dynamically import Interactive3DModel to avoid SSR issues
const Interactive3DModel = dynamic(() => import("@/components/Interactive3DModel"), { ssr: false })
const DynamicBackground = dynamic(() => import("@/components/DynamicBackground"), { ssr: false, loading: () => <div /> })

export default function HeroLanding() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#181c2f] via-[#232a4d] to-[#1a1e2e]">
      {/* Animated D/particle background */}
      <Suspense fallback={null}>
        <DynamicBackground />
      </Suspense>
      {/* Centered glass card with 3D model and content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-12 min-h-screen">
        <LiquidGlassCard
          className="mx-auto max-w-2xl w-full flex flex-col items-center justify-center py-12 px-6 md:px-12 shadow-2xl"
          blurIntensity="lg"
          variant="primary"
          hoverGlow
        >
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full flex justify-center mb-6">
              <div style={{ width: 340, maxWidth: "100%" }}>
                <Interactive3DModel />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-center mb-4 tracking-tight bg-gradient-to-r from-glass-teal via-glass-indigo to-glass-purple bg-clip-text text-transparent drop-shadow-lg">
              InnerCompass AI
            </h1>
            <p className="text-lg md:text-2xl text-center font-light mb-8 text-glass-silver/90 max-w-xl mx-auto">
              Navigate Your Potential.
            </p>
            <LiquidGlassButton className="mt-2 px-8 py-3 text-lg font-semibold shadow-xl">
              Get Started
            </LiquidGlassButton>
          </div>
        </LiquidGlassCard>
      </div>
      {/* Optional: subtle overlay for extra depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-glass-teal/5 to-glass-indigo/10" />
    </div>
  )
}
