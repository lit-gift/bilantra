"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, DollarSign, Package, BarChart3, PieChart, X } from "lucide-react"
import { useLanguage } from "@/app/page"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart as RechartsPieChart,
  Cell,
  BarChart,
  Bar,
} from "recharts"

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
  cashFlowData: Array<{
    id: number
    type: "income" | "expense"
    amount: number
    description: string
    date: string
    time: string
  }>
  inventoryData: Array<{
    id: number
    name: string
    stock: number
    minStock: number
    price: number
    status: "good" | "low" | "critical"
  }>
  currency: string
  language: string
  lastActivity: number
}

interface AdvancedReportsProps {
  userData: UserData
  isOpen: boolean
  onClose: () => void
}

export function AdvancedReports({ userData, isOpen, onClose }: AdvancedReportsProps) {
  const [selectedReport, setSelectedReport] = useState("financial")
  const [dateRange, setDateRange] = useState("30")
  const [isGenerating, setIsGenerating] = useState(false)
  const { t } = useLanguage()

  const currencySymbol = currencies[userData.currency as keyof typeof currencies] || "$"

  const reportTypes = [
    { id: "financial", name: "Financial Summary", icon: DollarSign },
    { id: "inventory", name: "Inventory Report", icon: Package },
    { id: "cashflow", name: "Cash Flow Analysis", icon: TrendingUp },
    { id: "performance", name: "Performance Metrics", icon: BarChart3 },
  ]

  // Generate sample data for reports
  const generateFinancialData = () => {
    const totalRevenue = userData.salesData.reduce((sum, day) => sum + day.revenue, 0)
    const totalExpenses = userData.cashFlowData
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    const totalIncome = userData.cashFlowData.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    return {
      revenue: totalRevenue,
      expenses: totalExpenses,
      income: totalIncome,
      profit: totalRevenue + totalIncome - totalExpenses,
      profitMargin:
        totalRevenue > 0
          ? (((totalRevenue + totalIncome - totalExpenses) / (totalRevenue + totalIncome)) * 100).toFixed(1)
          : 0,
    }
  }

  const generateInventoryData = () => {
    const totalValue = userData.inventoryData.reduce((sum, item) => sum + item.stock * item.price, 0)
    const lowStockItems = userData.inventoryData.filter((item) => item.status !== "good").length
    const totalItems = userData.inventoryData.length

    return {
      totalValue,
      totalItems,
      lowStockItems,
      stockTurnover: "2.3x", // Simulated
      averageValue: totalItems > 0 ? totalValue / totalItems : 0,
    }
  }

  const generateCashFlowData = () => {
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleDateString("en", { month: "short" })

      monthlyData.push({
        month: monthName,
        income: Math.random() * 5000 + 2000,
        expenses: Math.random() * 3000 + 1000,
        net: Math.random() * 2000 + 500,
      })
    }
    return monthlyData
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const reportData = generateReportContent()
    downloadReport(reportData)

    setIsGenerating(false)
  }

  const generateReportContent = () => {
    const financial = generateFinancialData()
    const inventory = generateInventoryData()

    return `
BILANTRA OS - ADVANCED BUSINESS REPORT
Generated: ${new Date().toLocaleDateString()}
Business: ${userData.profile.businessName}
Period: Last ${dateRange} days

=== FINANCIAL SUMMARY ===
Total Revenue: ${currencySymbol}${financial.revenue.toLocaleString()}
Total Expenses: ${currencySymbol}${financial.expenses.toLocaleString()}
Net Profit: ${currencySymbol}${financial.profit.toLocaleString()}
Profit Margin: ${financial.profitMargin}%

=== INVENTORY OVERVIEW ===
Total Inventory Value: ${currencySymbol}${inventory.totalValue.toLocaleString()}
Total Items: ${inventory.totalItems}
Low Stock Alerts: ${inventory.lowStockItems}
Average Item Value: ${currencySymbol}${inventory.averageValue.toFixed(2)}

=== CASH FLOW ANALYSIS ===
${userData.cashFlowData
  .map(
    (transaction) =>
      `${transaction.date}: ${transaction.type === "income" ? "+" : "-"}${currencySymbol}${transaction.amount} - ${transaction.description}`,
  )
  .join("\n")}

=== RECOMMENDATIONS ===
• Monitor cash flow trends for better financial planning
• Consider restocking low inventory items
• Optimize expense categories for improved profitability
• Implement automated alerts for critical business metrics

Generated by Bilantra OS - Advanced Business Management Platform
    `
  }

  const downloadReport = (content: string) => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `bilantra-report-${selectedReport}-${Date.now()}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const renderReportContent = () => {
    switch (selectedReport) {
      case "financial":
        return <FinancialReport userData={userData} currencySymbol={currencySymbol} />
      case "inventory":
        return <InventoryReport userData={userData} currencySymbol={currencySymbol} />
      case "cashflow":
        return <CashFlowReport userData={userData} currencySymbol={currencySymbol} />
      case "performance":
        return <PerformanceReport userData={userData} currencySymbol={currencySymbol} />
      default:
        return <FinancialReport userData={userData} currencySymbol={currencySymbol} />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Advanced Reports</h2>
                  <p className="text-white/70">Comprehensive business analytics and insights</p>
                </div>
                <Button
                  onClick={onClose}
                  size="sm"
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r border-white/20 p-4">
                  <div className="space-y-2">
                    {reportTypes.map((report) => {
                      const Icon = report.icon
                      return (
                        <button
                          key={report.id}
                          onClick={() => setSelectedReport(report.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                            selectedReport === report.id
                              ? "bg-[#1A1A40]/20 text-[#FFD700]"
                              : "text-white hover:bg-white/10"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{report.name}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Filters */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Date Range</label>
                      <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                      >
                        <option value="7" className="bg-slate-800">
                          Last 7 days
                        </option>
                        <option value="30" className="bg-slate-800">
                          Last 30 days
                        </option>
                        <option value="90" className="bg-slate-800">
                          Last 3 months
                        </option>
                        <option value="365" className="bg-slate-800">
                          Last year
                        </option>
                      </select>
                    </div>

                    <Button
                      onClick={handleGenerateReport}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                    >
                      {isGenerating ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-4 h-4 mr-2"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </motion.div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Export Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">{renderReportContent()}</div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function FinancialReport({ userData, currencySymbol }: { userData: UserData; currencySymbol: string }) {
  const totalRevenue = userData.salesData.reduce((sum, day) => sum + day.revenue, 0)
  const totalExpenses = userData.cashFlowData.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
  const totalIncome = userData.cashFlowData.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalRevenue + totalIncome - totalExpenses

  const pieData = [
    { name: "Revenue", value: totalRevenue, color: "#FFD700" },
    { name: "Other Income", value: totalIncome, color: "#1A1A40" },
    { name: "Expenses", value: totalExpenses, color: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Financial Summary</h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <DollarSign className="w-4 h-4 text-[#FFD700] mr-2" />
            <span className="text-white/60 text-sm">Total Revenue</span>
          </div>
          <p className="text-xl font-bold text-white">
            {currencySymbol}
            {totalRevenue.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-white/60 text-sm">Net Profit</span>
          </div>
          <p className={`text-xl font-bold ${netProfit >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {currencySymbol}
            {netProfit.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <BarChart3 className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-white/60 text-sm">Expenses</span>
          </div>
          <p className="text-xl font-bold text-white">
            {currencySymbol}
            {totalExpenses.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <PieChart className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-white/60 text-sm">Profit Margin</span>
          </div>
          <p className="text-xl font-bold text-white">
            {totalRevenue > 0 ? ((netProfit / (totalRevenue + totalIncome)) * 100).toFixed(1) : 0}%
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-4 bg-white/5">
          <h4 className="text-white font-semibold mb-4">Revenue Breakdown</h4>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <RechartsPieChart data={pieData}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
            </RechartsPieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 bg-white/5">
          <h4 className="text-white font-semibold mb-4">Weekly Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={userData.salesData}>
              <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}

function InventoryReport({ userData, currencySymbol }: { userData: UserData; currencySymbol: string }) {
  const totalValue = userData.inventoryData.reduce((sum, item) => sum + item.stock * item.price, 0)
  const lowStockItems = userData.inventoryData.filter((item) => item.status !== "good")

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Inventory Report</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <Package className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-white/60 text-sm">Total Value</span>
          </div>
          <p className="text-xl font-bold text-white">
            {currencySymbol}
            {totalValue.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <BarChart3 className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-white/60 text-sm">Total Items</span>
          </div>
          <p className="text-xl font-bold text-white">{userData.inventoryData.length}</p>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-4 h-4 text-orange-400 mr-2" />
            <span className="text-white/60 text-sm">Low Stock</span>
          </div>
          <p className="text-xl font-bold text-orange-400">{lowStockItems.length}</p>
        </Card>
      </div>

      {/* Low Stock Items */}
      {lowStockItems.length > 0 && (
        <Card className="p-4 bg-white/5">
          <h4 className="text-white font-semibold mb-4">Items Requiring Attention</h4>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-white/60 text-sm">
                    Current: {item.stock} | Min: {item.minStock}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    item.status === "critical" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function CashFlowReport({ userData, currencySymbol }: { userData: UserData; currencySymbol: string }) {
  const monthlyData = [
    { month: "Jan", income: 4500, expenses: 2800 },
    { month: "Feb", income: 5200, expenses: 3100 },
    { month: "Mar", income: 4800, expenses: 2900 },
    { month: "Apr", income: 5500, expenses: 3200 },
    { month: "May", income: 6100, expenses: 3400 },
    { month: "Jun", income: 5800, expenses: 3300 },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Cash Flow Analysis</h3>

      <Card className="p-4 bg-white/5">
        <h4 className="text-white font-semibold mb-4">Monthly Cash Flow Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Bar dataKey="income" fill="#FFD700" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-4 bg-white/5">
        <h4 className="text-white font-semibold mb-4">Recent Transactions</h4>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {userData.cashFlowData.slice(0, 10).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
              <div>
                <p className="text-white text-sm">{transaction.description}</p>
                <p className="text-white/60 text-xs">{transaction.date}</p>
              </div>
              <span className={`font-medium ${transaction.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                {transaction.type === "income" ? "+" : "-"}
                {currencySymbol}
                {transaction.amount}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function PerformanceReport({ userData, currencySymbol }: { userData: UserData; currencySymbol: string }) {
  const totalRevenue = userData.salesData.reduce((sum, day) => sum + day.revenue, 0)
  const avgDailyRevenue = totalRevenue / userData.salesData.length
  const bestDay = userData.salesData.reduce(
    (max, day) => (day.revenue > max.revenue ? day : max),
    userData.salesData[0],
  )

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Performance Metrics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-400 mr-2" />
            <span className="text-white/60 text-sm">Avg Daily Revenue</span>
          </div>
          <p className="text-xl font-bold text-white">
            {currencySymbol}
            {avgDailyRevenue.toFixed(0)}
          </p>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <BarChart3 className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-white/60 text-sm">Best Day</span>
          </div>
          <p className="text-xl font-bold text-white">{bestDay?.day || "N/A"}</p>
          <p className="text-white/60 text-sm">
            {currencySymbol}
            {bestDay?.revenue || 0}
          </p>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <Package className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-white/60 text-sm">Inventory Turnover</span>
          </div>
          <p className="text-xl font-bold text-white">2.3x</p>
        </Card>

        <Card className="p-4 bg-white/5">
          <div className="flex items-center mb-2">
            <DollarSign className="w-4 h-4 text-[#FFD700] mr-2" />
            <span className="text-white/60 text-sm">Growth Rate</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">+12.5%</p>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="p-4 bg-white/5">
        <h4 className="text-white font-semibold mb-4">Weekly Performance</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={userData.salesData}>
            <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
            <YAxis tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Line type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
