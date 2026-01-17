"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { month: "Январ", bajarildi: 20, yaratildi: 25 },
  { month: "Феврал", bajarildi: 25, yaratildi: 28 },
  { month: "Март", bajarildi: 32, yaratildi: 35 },
  { month: "Апрел", bajarildi: 28, yaratildi: 30 },
  { month: "Май", bajarildi: 22, yaratildi: 25 },
  { month: "Июн", bajarildi: 35, yaratildi: 38 },
]

export function ActivityChart() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Топшириқлар динамикаси</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="bajarildi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="yaratildi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(240, 60%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(240, 60%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 10%, 25%)" />
              <XAxis dataKey="month" stroke="hsl(240, 5%, 50%)" fontSize={12} tickLine={false} />
              <YAxis stroke="hsl(240, 5%, 50%)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(240, 10%, 15%)",
                  border: "1px solid hsl(240, 10%, 25%)",
                  borderRadius: "8px",
                  color: "hsl(0, 0%, 95%)",
                }}
              />
              <Area
                type="monotone"
                dataKey="bajarildi"
                stroke="hsl(160, 60%, 45%)"
                fillOpacity={1}
                fill="url(#bajarildi)"
                name="Bajarildi"
              />
              <Area
                type="monotone"
                dataKey="yaratildi"
                stroke="hsl(240, 60%, 50%)"
                fillOpacity={1}
                fill="url(#yaratildi)"
                name="Yaratildi"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-sm text-muted-foreground">Bajarildi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Yaratildi</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
