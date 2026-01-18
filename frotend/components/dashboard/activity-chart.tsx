"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { BarChart3 } from "lucide-react"

const data = [
  { month: "Январ", bajarildi: 20, yaratildi: 25, jami: 45 },
  { month: "Феврал", bajarildi: 25, yaratildi: 28, jami: 53 },
  { month: "Март", bajarildi: 32, yaratildi: 35, jami: 67 },
  { month: "Апрел", bajarildi: 28, yaratildi: 30, jami: 58 },
  { month: "Май", bajarildi: 22, yaratildi: 25, jami: 47 },
  { month: "Июн", bajarildi: 35, yaratildi: 38, jami: 73 },
]

export function ActivityChart() {
  return (
    <Card className="card-modern">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <CardTitle className="text-lg font-semibold">Топшириқлар динамикаси</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="bajarildi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="yaratildi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(240, 60%, 50%)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="hsl(240, 60%, 50%)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="jami" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(27, 87%, 67%)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="hsl(27, 87%, 67%)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="hsl(240, 10%, 25%)" 
                className="opacity-30"
              />
              
              <XAxis 
                dataKey="month" 
                stroke="hsl(240, 5%, 50%)" 
                fontSize={12} 
                tickLine={false}
                tick={{ fill: 'hsl(240, 5%, 50%)' }}
              />
              
              <YAxis 
                stroke="hsl(240, 5%, 50%)" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tick={{ fill: 'hsl(240, 5%, 50%)' }}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(240, 10%, 15%)",
                  border: "1px solid hsl(240, 10%, 25%)",
                  borderRadius: "8px",
                  color: "hsl(0, 0%, 95%)",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
                labelStyle={{ color: 'hsl(240, 5%, 50%)', fontWeight: 500 }}
              />
              
              <Area
                type="monotone"
                dataKey="jami"
                stroke="hsl(27, 87%, 67%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#jami)"
                name="Жами"
                strokeOpacity={0.6}
              />
              
              <Area
                type="monotone"
                dataKey="bajarildi"
                stroke="hsl(142, 76%, 36%)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#bajarildi)"
                name="Бажарилган"
              />
              
              <Area
                type="monotone"
                dataKey="yaratildi"
                stroke="hsl(240, 60%, 50%)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#yaratildi)"
                name="Яратилган"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-foreground">Бажарилган</span>
            <span className="text-xs text-muted-foreground">({data.reduce((sum, item) => sum + item.bajarildi, 0)})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-foreground">Яратилган</span>
            <span className="text-xs text-muted-foreground">({data.reduce((sum, item) => sum + item.yaratildi, 0)})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm text-foreground">Жами</span>
            <span className="text-xs text-muted-foreground">({data.reduce((sum, item) => sum + item.jami, 0)})</span>
          </div>
        </div>
        
        {/* Stats summary */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="text-2xl font-bold text-green-600">{data[data.length - 1].bajarildi}</div>
            <div className="text-xs text-muted-foreground">Ойлик бажарилган</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{data[data.length - 1].yaratildi}</div>
            <div className="text-xs text-muted-foreground">Ойлик яратилган</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="text-2xl font-bold text-amber-600">{data[data.length - 1].jami}</div>
            <div className="text-xs text-muted-foreground">Ойлик жами</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
