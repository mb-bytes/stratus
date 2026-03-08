"use client"

import type { CSSProperties } from "react"
import { useEffect, useState } from "react"
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import api from "../../../../libs/axiosInstance.js"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./CardUI.js"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ChartUI.js"

const STATUS_KEYS = ["applied", "interviewed", "offered", "rejected"] as const
type StatusKey = typeof STATUS_KEYS[number]

const chartConfig = {
  applied:     { label: "Applied",      color: "#4f1fe8" },
  interviewed: { label: "Interviewing", color: "#7c5af0" },
  offered:     { label: "Offered",      color: "#a78ffa" },
  rejected:    { label: "Rejected",     color: "#93c5fd" },
} satisfies ChartConfig

type ChartRow = { name: StatusKey; count: number; fill: string }

export function Pattern() {
  const [chartData, setChartData] = useState<ChartRow[]>(
    STATUS_KEYS.map((name) => ({
      name,
      count: 0,
      fill: `url(#chart28-${name})`,
    }))
  )

  const fetchData = () => {
    api
      .get("/api/jobs")
      .then(({ data }) => {
        const jobs: { status?: string }[] = data.jobs ?? []
        const counts = Object.fromEntries(
          STATUS_KEYS.map((k) => [k, 0])
        ) as Record<StatusKey, number>
        for (const job of jobs) {
          const s = (job.status ?? "").toLowerCase() as StatusKey
          if (s in counts) counts[s]++
        }
        setChartData(
          STATUS_KEYS.map((name) => ({
            name,
            count: counts[name],
            fill: `url(#chart28-${name})`,
          }))
        )
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchData()
    window.addEventListener("focus", fetchData)
    return () => window.removeEventListener("focus", fetchData)
  }, [])

  const total = chartData.reduce((s, d) => s + d.count, 0)

  return (
    <Card className="w-full max-w-sm border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>Application Status</CardTitle>
        <CardDescription>
          {total} total application{total !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={35}
            outerRadius={110}
            barSize={22}
          >
            <defs>
              {STATUS_KEYS.map((key) => (
                <linearGradient
                  key={key}
                  id={`chart28-${key}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="100%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={1}
                  />
                </linearGradient>
              ))}
              <filter
                id="chart28-glow"
                x="-15%"
                y="-15%"
                width="130%"
                height="130%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-40 gap-2.5"
                  nameKey="name"
                  formatter={(value: unknown, _name: unknown, item: { payload?: Record<string, unknown> }) => {
                    const statusKey = String(item.payload?.name ?? "") as StatusKey
                    const count = Number(value)
                    const cfg = chartConfig[statusKey as keyof typeof chartConfig]
                    return (
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-xs"
                            style={{
                              background: cfg?.color ?? `var(--color-${statusKey})`,
                            } as CSSProperties}
                          />
                          <span className="text-muted-foreground">
                            {cfg?.label ?? statusKey}
                          </span>
                        </div>
                        <span className="text-foreground font-semibold tabular-nums">
                          {count} job{count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )
                  }}
                />
              }
            />

            <PolarAngleAxis
              type="number"
              domain={[0, Math.max(total, 1)]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="count"
              background
              cornerRadius={10}
              filter="url(#chart28-glow)"
              label={{
                position: "insideStart",
                fill: "#000",
                fontSize: 11,
                fontWeight: 600,
              }}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
