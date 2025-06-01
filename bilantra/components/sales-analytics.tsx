"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, DollarSign, Plus, Edit3, BarChart3, PieChart, Activity } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, BarChart, Bar } from "recharts"
import { useLanguage } from "@/app/page"

const currencies = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF",
  CAD: "C$",
  AUD: "A$",
  NZD: "NZ$",
  ZAR: "R",
  NGN: "₦",
  KES: "KSh",
  GHS: "₵",
  EGP: "£E",
  MAD: "DH",
  TZS: "TSh",
  UGX: "USh",
  ETB: "Br",
  XOF: "CFA",
  XAF: "FCFA",
  BWP: "P",
  MUR: "₨",
  TND: "د.ت",
  ZMW: "ZK",
  CNY: "¥",
  INR: "₹",
  KRW: "₩",
  SGD: "S$",
  HKD: "HK$",
  THB: "฿",
  MYR: "RM",
  IDR: "Rp",
  PHP: "₱",
  VND: "₫",
  PKR: "₨",
  BDT: "৳",
  LKR: "₨",
  AED: "د.إ",
  SAR: "﷼",
  QAR: "﷼",
  KWD: "د.ك",
  BHD: ".د.ب",
  OMR: "﷼",
  JOD: "د.ا",
  LBP: "ل.ل",
  ILS: "₪",
  IRR: "﷼",
  TRY: "₺",
  BRL: "R$",
  MXN: "$",
  ARS: "$",
  CLP: "$",
  COP: "$",
  PEN: "S/",
  UYU: "$U",
  BOB: "Bs",
  PYG: "₲",
  NOK: "kr",
  SEK: "kr",
  DKK: "kr",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
  RON: "lei",
  BGN: "лв",
  HRK: "kn",
  RSD: "дин",
  RUB: "₽",
  UAH: "₴",
  ISK: "kr",
  ALL: "L",
  MKD: "ден",
  BAM: "KM",
}

interface UserData {
  profile: any
  salesData: Array<{ day: string; revenue: number }>
  cashFlowData: any[]
  inventoryData: any[]
  currency: string
  language: string
  lastActivity: number
}

interface SalesAnalyticsProps {
  userData: UserData
  onUpdateData: (updates: Partial<UserData>) => void
}

export function SalesAnalytics({ userData, onUpdateData }: SalesAnalyticsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newRevenue, setNewRevenue] = useState("")
  const [selectedDay, setSelectedDay] = useState("")
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("weekly")
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line")
  const { t } = useLanguage()

  const currencySymbol = currencies[userData.currency as keyof typeof currencies] || "$"
  const totalRevenue = userData.salesData.reduce((sum, day) => sum + day.revenue, 0)
  const previousWeek = Math.max(0, totalRevenue - 1000) // Simulate previous week
  const growthPercentage = previousWeek > 0 ? (((totalRevenue - previousWeek) / previousWeek) * 100).toFixed(1) : "0"

  // Enhanced data processing
  const getChartData = () => {
    switch (period) {
      case "weekly":
        return userData.salesData
      case "monthly":
        return [
          { day: "Week 1", revenue: userData.salesData.slice(0, 2).reduce((sum, day) => sum + day.revenue, 0) },
          { day: "Week 2", revenue: userData.salesData.slice(2, 4).reduce((sum, day) => sum + day.revenue, 0) },
          { day: "Week 3", revenue: userData.salesData.slice(4, 6).reduce((sum, day) => sum + day.revenue, 0) },
          { day: "Week 4", revenue: userData.salesData.slice(6, 7).reduce((sum, day) => sum + day.revenue, 0) },
        ]
      case "yearly":
        return [
          { day: "Q1", revenue: totalRevenue * 0.8 },
          { day: "Q2", revenue: totalRevenue * 1.2 },
          { day: "Q3", revenue: totalRevenue * 1.5 },
          { day: "Q4", revenue: totalRevenue * 0.9 },
        ]
      default:
        return userData.salesData
    }
  }

  const chartData = getChartData()
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue))
  const avgRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0) / chartData.length

  const handleAddRevenue = () => {
    if (!selectedDay || !newRevenue) return

    const updatedSalesData = userData.salesData.map((day) =>
      day.day === selectedDay ? { ...day, revenue: day.revenue + Number.parseFloat(newRevenue) } : day,
    )

    onUpdateData({ salesData: updatedSalesData })
    setNewRevenue("")
    setSelectedDay("")
    setIsEditing(false)
  }

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1A1A40" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
              formatter={(value) => [`${currencySymbol}${value}`, t("revenue")]}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#FFD700"
              fillOpacity={1}
              fill="url(#colorRevenue)"
              strokeWidth={3}
            />
          </AreaChart>
        )
      case "bar":
        return (
          <BarChart {...commonProps}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
              formatter={(value) => [`${currencySymbol}${value}`, t("revenue")]}
            />
            <Bar dataKey="revenue" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFD700" />
                <stop offset="100%" stopColor="#1A1A40" />
              </linearGradient>
            </defs>
          </BarChart>
        )
      default:
        return (
          <LineChart {...commonProps}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
              formatter={(value) => [`${currencySymbol}${value}`, t("revenue")]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="url(#gradient)"
              strokeWidth={3}
              dot={{ fill: "#FFD700", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#FFD700" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1A1A40" />
                <stop offset="100%" stopColor="#FFD700" />
              </linearGradient>
            </defs>
          </LineChart>
        )
    }
  }

  return (
    <Card className="p-4 md:p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 space-y-2 md:space-y-0">
        <h3 className="text-lg font-semibold text-white">{t("revenue")}</h3>
        <div className="flex items-center space-x-2">
          <motion.div
            className="flex items-center text-[#FFD700]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">+{growthPercentage}%</span>
          </motion.div>
          <Button
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="bg-[#FFD700]/20 hover:bg-[#FFD700]/30 text-[#FFD700] border border-[#FFD700]/30"
          >
            {isEditing ? <Edit3 className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* Enhanced Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <DollarSign className="w-4 h-4 text-[#FFD700] mr-1" />
            <span className="text-xs text-white/60">Total</span>
          </div>
          <p className="text-lg font-bold text-white">
            {currencySymbol}
            {totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-400 mr-1" />
            <span className="text-xs text-white/60">Average</span>
          </div>
          <p className="text-lg font-bold text-white">
            {currencySymbol}
            {avgRevenue.toFixed(0)}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <Activity className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-xs text-white/60">Peak</span>
          </div>
          <p className="text-lg font-bold text-white">
            {currencySymbol}
            {maxRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center mb-1">
            <TrendingUp className="w-4 h-4 text-purple-400 mr-1" />
            <span className="text-xs text-white/60">Growth</span>
          </div>
          <p className="text-lg font-bold text-white">+{growthPercentage}%</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0">
        {/* Period Selection */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={period === "weekly" ? "default" : "outline"}
            onClick={() => setPeriod("weekly")}
            className={
              period === "weekly"
                ? "bg-[#1A1A40] text-[#FFD700] hover:bg-[#1A1A40]/80"
                : "border-white/20 text-white hover:bg-white/10"
            }
          >
            {t("weeklyRevenue")}
          </Button>
          <Button
            size="sm"
            variant={period === "monthly" ? "default" : "outline"}
            onClick={() => setPeriod("monthly")}
            className={
              period === "monthly"
                ? "bg-[#1A1A40] text-[#FFD700] hover:bg-[#1A1A40]/80"
                : "border-white/20 text-white hover:bg-white/10"
            }
          >
            {t("monthlyRevenue")}
          </Button>
          <Button
            size="sm"
            variant={period === "yearly" ? "default" : "outline"}
            onClick={() => setPeriod("yearly")}
            className={
              period === "yearly"
                ? "bg-[#1A1A40] text-[#FFD700] hover:bg-[#1A1A40]/80"
                : "border-white/20 text-white hover:bg-white/10"
            }
          >
            {t("yearlyRevenue")}
          </Button>
        </div>

        {/* Chart Type Selection */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={chartType === "line" ? "default" : "outline"}
            onClick={() => setChartType("line")}
            className={
              chartType === "line"
                ? "bg-[#1A1A40] text-[#FFD700] hover:bg-[#1A1A40]/80"
                : "border-white/20 text-white hover:bg-white/10"
            }
          >
            <Activity className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant={chartType === "area" ? "default" : "outline"}
            onClick={() => setChartType("area")}
            className={
              chartType === "area"
                ? "bg-[#1A1A40] text-[#FFD700] hover:bg-[#1A1A40]/80"
                : "border-white/20 text-white hover:bg-white/10"
            }
          >
            <BarChart3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant={chartType === "bar" ? "default" : "outline"}
            onClick={() => setChartType("bar")}
            className={
              chartType === "bar"
                ? "bg-[#1A1A40] text-[#FFD700] hover:bg-[#1A1A40]/80"
                : "border-white/20 text-white hover:bg-white/10"
            }
          >
            <PieChart className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {isEditing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10"
        >
          <div className="space-y-3">
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
            >
              <option value="">Select Day</option>
              {userData.salesData.map((day) => (
                <option key={day.day} value={day.day} className="bg-slate-800">
                  {day.day}
                </option>
              ))}
            </select>
            <Input
              type="number"
              placeholder="Revenue amount"
              value={newRevenue}
              onChange={(e) => setNewRevenue(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button
              onClick={handleAddRevenue}
              disabled={!selectedDay || !newRevenue}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Add Revenue
            </Button>
          </div>
        </motion.div>
      )}

      <motion.div
        className="h-48 md:h-64"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </motion.div>
    </Card>
  )
}
