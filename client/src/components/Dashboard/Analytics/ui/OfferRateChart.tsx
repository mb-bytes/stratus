"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import api from "../../../../libs/axiosInstance.js"

// ─── Types ───────────────────────────────────────────────────────────────────

interface RateData {
  offerRate: number
  acceptRate: number
  offered: number
  total: number
}

// ─── Single animated SVG ring ─────────────────────────────────────────────────

interface RingProps {
  cx: number
  cy: number
  r: number
  strokeWidth: number
  pct: number
  color: string
  delay?: number
}

function AnimatedRing({ cx, cy, r, strokeWidth, pct, color, delay = 0 }: RingProps) {
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference * (1 - pct / 100)

  return (
    <>
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#e5e7eb"
        strokeWidth={strokeWidth} strokeLinecap="round" opacity={0.45}
      />
      <motion.circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke={color}
        strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference}
        transform={`rotate(-90 ${cx} ${cy})`}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: dashOffset }}
        transition={{ duration: 1.4, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </>
  )
}

// ─── Animated count-up ────────────────────────────────────────────────────────

function AnimatedCounter({ value, delay = 0 }: { value: number; delay?: number }) {
  const [display, setDisplay] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const DURATION = 1400

  useEffect(() => {
    if (value === 0) { setDisplay(0); return }
    startRef.current = null
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts + delay * 1000
      const elapsed = Math.max(0, ts - startRef.current)
      const progress = Math.min(elapsed / DURATION, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [value, delay])

  return <>{display}</>
}

// ─── Main component ───────────────────────────────────────────────────────────

export function OfferRateChart() {
  const [data, setData] = useState<RateData>({ offerRate: 0, acceptRate: 0, offered: 0, total: 0 })
  const [animated, setAnimated] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, margin: "0px 0px -40px 0px" })

  const fetchData = () => {
    api.get("/api/jobs")
      .then(({ data: res }) => {
        const jobs: { status?: string }[] = res.jobs ?? []
        const total = jobs.length
        const offered = jobs.filter(j => (j.status ?? "").toLowerCase() === "offered").length
        const rejected = jobs.filter(j => (j.status ?? "").toLowerCase() === "rejected").length
        const offerRate = total > 0 ? Math.round((offered / total) * 100) : 0
        const resolved = offered + rejected
        const acceptRate = resolved > 0 ? Math.round((offered / resolved) * 100) : 0
        setData({ offerRate, acceptRate, offered, total })
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchData()
    window.addEventListener("focus", fetchData)
    return () => window.removeEventListener("focus", fetchData)
  }, [])

  useEffect(() => {
    setAnimated(isInView)
  }, [isInView])

  // SVG
  const SIZE = 260
  const CX = SIZE / 2
  const CY = SIZE / 2
  const OUTER_R = 108
  const INNER_R = 78
  const STROKE = 16

  const OFFER_COLOR  = "#4f1fe8"
  const ACCEPT_COLOR = "#a78ffa"

  const displayOffer  = animated ? data.offerRate  : 0
  const displayAccept = animated ? data.acceptRate : 0

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-sm border border-gray-100 w-full"
      style={{ fontFamily: "Poppins, sans-serif", maxWidth: 420 }}
    >
      {/* ── Header ── */}
      <div className="w-full">
        <p className="text-base font-semibold text-gray-800 text-balance">Offer Rate</p>
        <p className="text-sm text-gray-400 text-pretty mt-0.5">
          Based on {data.total} application{data.total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Dual-ring SVG ── */}
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-label="Offer and accept rate radial chart"
        role="img"
      >
        {/* Outer — Offer Rate */}
        <AnimatedRing cx={CX} cy={CY} r={OUTER_R} strokeWidth={STROKE} pct={displayOffer}  color={OFFER_COLOR}  delay={0}    />
        {/* Inner — Accept Rate */}
        <AnimatedRing cx={CX} cy={CY} r={INNER_R} strokeWidth={STROKE} pct={displayAccept} color={ACCEPT_COLOR} delay={0.15} />

        {/* Centre % */}
        <text
          x={CX} y={CY - 10}
          textAnchor="middle" dominantBaseline="middle"
          className="tabular-nums"
          style={{ fontSize: 38, fontWeight: 700, fill: "#111827", fontFamily: "Poppins, sans-serif" }}
        >
          <AnimatedCounter value={displayOffer} />%
        </text>
        <text
          x={CX} y={CY + 18}
          textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 11, fill: "#9ca3af", fontFamily: "Poppins, sans-serif" }}
        >
          offer rate
        </text>
      </svg>

      {/* ── Stat pills row ── */}
      <div className="flex w-full gap-3">
        {/* Offer Rate pill */}
        <motion.div
          className="flex flex-1 flex-col gap-1 rounded-2xl bg-gray-50 px-4 py-3"
          initial={{ opacity: 0, y: 10 }}
          animate={animated ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
        >
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full shrink-0" style={{ background: OFFER_COLOR }} />
            <span className="text-xs text-gray-500">Offer Rate</span>
          </div>
          <p className="text-2xl font-bold tabular-nums" style={{ color: OFFER_COLOR }}>
            <AnimatedCounter value={displayOffer} />%
          </p>
        </motion.div>

        {/* Accept Rate pill */}
        <motion.div
          className="flex flex-1 flex-col gap-1 rounded-2xl bg-gray-50 px-4 py-3"
          initial={{ opacity: 0, y: 10 }}
          animate={animated ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.3 }}
        >
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full shrink-0" style={{ background: ACCEPT_COLOR }} />
            <span className="text-xs text-gray-500">Accept Rate</span>
          </div>
          <p className="text-2xl font-bold tabular-nums" style={{ color: ACCEPT_COLOR }}>
            <AnimatedCounter value={displayAccept} delay={0.15} />%
          </p>
        </motion.div>
      </div>

      {/* ── Offers received footnote ── */}
      <motion.p
        className="text-xs text-gray-400 w-full"
        initial={{ opacity: 0 }}
        animate={animated ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.45 }}
      >
        {data.offered} offer{data.offered !== 1 ? "s" : ""} received
      </motion.p>
    </div>
  )
}
