"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Lightbulb,
  Target,
  DollarSign,
  Package,
  Users,
  X,
  Sparkles,
} from "lucide-react"
import { useLanguage } from "@/app/page"

const currencies = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  KES: "KSh",
  NGN: "₦",
  GHS: "₵",
  ZAR: "R",
  EGP: "£E",
  MAD: "DH",
  TZS: "TSh",
  UGX: "USh",
  ETB: "Br",
  XOF: "CFA",
  BRL: "R$",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  AED: "د.إ",
  SAR: "﷼",
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

interface BusinessInsightsProps {
  userData: UserData
  isOpen: boolean
  onClose: () => void
}

interface Insight {
  id: string
  type: "opportunity" | "warning" | "recommendation" | "achievement"
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: "revenue" | "expenses" | "inventory" | "growth" | "efficiency"
  actionable: boolean
  priority: number
}

export function BusinessInsights({ userData, isOpen, onClose }: BusinessInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isGenerating, setIsGenerating] = useState(false)
  const { t } = useLanguage()

  const currencySymbol = currencies[userData.currency as keyof typeof currencies] || "$"

  useEffect(() => {
    if (isOpen) {
      generateInsights()
    }
  }, [isOpen, userData])

  const generateInsights = async () => {
    setIsGenerating(true)

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newInsights: Insight[] = []

    // Revenue Analysis
    const totalRevenue = userData.salesData.reduce((sum, day) => sum + day.revenue, 0)
    const avgDailyRevenue = totalRevenue / userData.salesData.length
    const bestDay = userData.salesData.reduce(
      (max, day) => (day.revenue > max.revenue ? day : max),
      userData.salesData[0],
    )

    if (totalRevenue > 0) {
      newInsights.push({
        id: "revenue-growth",
        type: "opportunity",
        title: "Revenue Growth Opportunity",
        description: `Your best performing day was ${bestDay?.day} with ${currencySymbol}${bestDay?.revenue}. Focus marketing efforts on replicating this success.`,
        impact: "high",
        category: "revenue",
        actionable: true,
        priority: 1,
      })
    }

    // Inventory Analysis
    const lowStockItems = userData.inventoryData.filter((item) => item.status !== "good").length
    const totalInventoryValue = userData.inventoryData.reduce((sum, item) => sum + item.stock * item.price, 0)

    if (lowStockItems > 0) {
      newInsights.push({
        id: "inventory-warning",
        type: "warning",
        title: "Inventory Stock Alert",
        description: `${lowStockItems} items are running low. Restock soon to avoid lost sales.`,
        impact: "medium",
        category: "inventory",
        actionable: true,
        priority: 2,
      })
    }

    // Cash Flow Analysis
    const totalIncome = userData.cashFlowData.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const totalExpenses = userData.cashFlowData
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
    const netFlow = totalIncome - totalExpenses

    if (netFlow > 0) {
      newInsights.push({
        id: "positive-cashflow",
        type: "achievement",
        title: "Positive Cash Flow",
        description: `Excellent! Your cash flow is positive with ${currencySymbol}${netFlow.toLocaleString()} net income.`,
        impact: "high",
        category: "growth",
        actionable: false,
        priority: 3,
      })
    } else if (netFlow < 0) {
      newInsights.push({
        id: "negative-cashflow",
        type: "warning",
        title: "Cash Flow Concern",
        description: `Your expenses exceed income by ${currencySymbol}${Math.abs(netFlow).toLocaleString()}. Review expenses and boost sales.`,
        impact: "high",
        category: "expenses",
        actionable: true,
        priority: 1,
      })
    }

    // Efficiency Insights
    if (userData.inventoryData.length > 0 && totalRevenue > 0) {
      const inventoryTurnover = totalRevenue / totalInventoryValue
      if (inventoryTurnover < 2) {
        newInsights.push({
          id: "inventory-efficiency",
          type: "recommendation",
          title: "Improve Inventory Turnover",
          description: "Your inventory turnover is low. Consider promotional sales to move slow-moving items.",
          impact: "medium",
          category: "efficiency",
          actionable: true,
          priority: 4,
        })
      } else {
        newInsights.push({
          id: "good-turnover",
          type: "achievement",
          title: "Efficient Inventory Management",
          description: "Great job! Your inventory turnover rate indicates efficient stock management.",
          impact: "medium",
          category: "efficiency",
          actionable: false,
          priority: 5,
        })
      }
    }

    // Growth Opportunities
    if (avgDailyRevenue > 0) {
      newInsights.push({
        id: "growth-potential",
        type: "opportunity",
        title: "Scale Your Business",
        description: `With ${currencySymbol}${avgDailyRevenue.toFixed(0)} average daily revenue, you're ready to explore loan options for expansion.`,
        impact: "high",
        category: "growth",
        actionable: true,
        priority: 2,
      })
    }

    // Seasonal Insights
    const dayPerformance = userData.salesData.map((d) => ({ day: d.day, revenue: d.revenue }))
    const topDays = dayPerformance.sort((a, b) => b.revenue - a.revenue).slice(0, 2)

    if (topDays.length > 0) {
      newInsights.push({
        id: "seasonal-pattern",
        type: "recommendation",
        title: "Optimize Peak Days",
        description: `${topDays.map((d) => d.day).join(" and ")} are your strongest days. Plan special promotions and ensure adequate stock.`,
        impact: "medium",
        category: "revenue",
        actionable: true,
        priority: 3,
      })
    }

    setInsights(newInsights.sort((a, b) => a.priority - b.priority))
    setIsGenerating(false)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="w-5 h-5" />
      case "warning":
        return <AlertCircle className="w-5 h-5" />
      case "recommendation":
        return <Lightbulb className="w-5 h-5" />
      case "achievement":
        return <Target className="w-5 h-5" />
      default:
        return <Sparkles className="w-5 h-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "opportunity":
        return "from-emerald-500 to-green-500"
      case "warning":
        return "from-red-500 to-orange-500"
      case "recommendation":
        return "from-blue-500 to-cyan-500"
      case "achievement":
        return "from-purple-500 to-pink-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "revenue":
        return <DollarSign className="w-4 h-4" />
      case "expenses":
        return <TrendingDown className="w-4 h-4" />
      case "inventory":
        return <Package className="w-4 h-4" />
      case "growth":
        return <TrendingUp className="w-4 h-4" />
      case "efficiency":
        return <Target className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const filteredInsights =
    selectedCategory === "all" ? insights : insights.filter((insight) => insight.category === selectedCategory)

  const categories = [
    { id: "all", name: "All Insights" },
    { id: "revenue", name: "Revenue" },
    { id: "expenses", name: "Expenses" },
    { id: "inventory", name: "Inventory" },
    { id: "growth", name: "Growth" },
    { id: "efficiency", name: "Efficiency" },
  ]

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
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Business Insights</h2>
                  <p className="text-white/70">AI-powered recommendations for your business</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={generateInsights}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                          className="w-4 h-4 mr-2"
                        >
                          <Sparkles className="w-4 h-4" />
                        </motion.div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Refresh Insights
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={onClose}
                    size="sm"
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="p-4 border-b border-white/20">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      size="sm"
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={
                        selectedCategory === category.id
                          ? "bg-[#1A1A40] text-[#FFD700] hover:bg-[#1A1A40]/80"
                          : "border-white/20 text-white hover:bg-white/10"
                      }
                    >
                      {getCategoryIcon(category.id)}
                      <span className="ml-2">{category.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Insights List */}
              <div className="flex-1 overflow-y-auto p-6">
                {isGenerating ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-12 h-12 mx-auto mb-4 text-[#FFD700]"
                      >
                        <Sparkles className="w-12 h-12" />
                      </motion.div>
                      <p className="text-white font-semibold">Analyzing your business data...</p>
                      <p className="text-white/60 text-sm">AI is generating personalized insights</p>
                    </div>
                  </div>
                ) : filteredInsights.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">No Insights Available</h3>
                    <p className="text-white/60 text-sm">Add more business data to get personalized insights</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredInsights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getInsightColor(insight.type)} flex items-center justify-center flex-shrink-0`}
                          >
                            {getInsightIcon(insight.type)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-white font-semibold">{insight.title}</h3>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    insight.impact === "high"
                                      ? "bg-red-500/20 text-red-400"
                                      : insight.impact === "medium"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-blue-500/20 text-blue-400"
                                  }`}
                                >
                                  {insight.impact} impact
                                </span>

                                <div className="flex items-center space-x-1 text-white/60">
                                  {getCategoryIcon(insight.category)}
                                  <span className="text-xs capitalize">{insight.category}</span>
                                </div>
                              </div>
                            </div>

                            <p className="text-white/70 text-sm leading-relaxed mb-3">{insight.description}</p>

                            {insight.actionable && (
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-[#1A1A40]/20 to-[#FFD700]/20 hover:from-[#1A1A40]/30 hover:to-[#FFD700]/30 border border-[#FFD700]/30 text-[#FFD700] text-xs"
                                >
                                  Take Action
                                </Button>
                                <span className="text-white/50 text-xs">Actionable insight</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <p className="text-white/50 text-xs">
                    Insights generated by Bilantra OS AI • Last updated: {new Date().toLocaleTimeString()}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-white/60">
                    <span>{insights.filter((i) => i.type === "opportunity").length} Opportunities</span>
                    <span>{insights.filter((i) => i.type === "warning").length} Warnings</span>
                    <span>{insights.filter((i) => i.actionable).length} Actionable</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
