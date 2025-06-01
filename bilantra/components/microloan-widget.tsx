"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Target, Lightbulb, ArrowRight, X, TrendingUp, Package, DollarSign } from "lucide-react"
import { useLanguage } from "@/app/page"

interface UserData {
  profile: any
  salesData: Array<{ day: string; revenue: number }>
  cashFlowData: any[]
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

interface MicroloanWidgetProps {
  userData: UserData
}

export function MicroloanWidget({ userData }: MicroloanWidgetProps) {
  const [progress, setProgress] = useState(0)
  const [showTip, setShowTip] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const { t } = useLanguage()

  // Calculate loan readiness score based on actual data
  const calculateReadinessScore = () => {
    let score = 0

    // Sales data (40% weight)
    const totalRevenue = userData.salesData.reduce((sum, day) => sum + day.revenue, 0)
    if (totalRevenue > 0) score += 40
    else if (totalRevenue > 1000) score += 35
    else if (totalRevenue > 500) score += 25

    // Inventory data (30% weight)
    const inventoryValue = userData.inventoryData.reduce((sum, item) => sum + item.stock * item.price, 0)
    if (inventoryValue > 2000) score += 30
    else if (inventoryValue > 1000) score += 25
    else if (inventoryValue > 500) score += 15
    else if (inventoryValue > 0) score += 10

    // Cash flow data (20% weight)
    const positiveTransactions = userData.cashFlowData.filter((t) => t.type === "income").length
    if (positiveTransactions > 5) score += 20
    else if (positiveTransactions > 2) score += 15
    else if (positiveTransactions > 0) score += 10

    // Business profile completeness (10% weight)
    if (userData.profile.businessName && userData.profile.city) score += 10

    return Math.min(score, 100)
  }

  const readinessScore = calculateReadinessScore()

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0
      const increment = readinessScore / 50
      const interval = setInterval(() => {
        current += increment
        if (current >= readinessScore) {
          current = readinessScore
          clearInterval(interval)
          setShowTip(true)
        }
        setProgress(current)
      }, 30)
    }, 800)

    return () => clearTimeout(timer)
  }, [readinessScore])

  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress / 100) * circumference

  const getRecommendations = () => {
    const recommendations = []

    if (userData.salesData.reduce((sum, day) => sum + day.revenue, 0) === 0) {
      recommendations.push("Start recording your daily sales to improve your score")
    }

    if (userData.inventoryData.length === 0) {
      recommendations.push("Add your inventory items to show business assets")
    }

    if (userData.cashFlowData.length < 3) {
      recommendations.push("Record more transactions to demonstrate cash flow")
    }

    if (recommendations.length === 0) {
      recommendations.push("Great! Your business data looks strong for loan applications")
    }

    return recommendations
  }

  return (
    <>
      <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{t("loanReadiness")}</h3>
          <Target className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="flex items-center justify-between">
          <div className="relative">
            <svg className="w-20 h-20 md:w-24 md:h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1A1A40" />
                  <stop offset="100%" stopColor="#FFD700" />
                </linearGradient>
              </defs>
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span
                className="text-lg md:text-xl font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                {Math.floor(progress)}%
              </motion.span>
            </div>
          </div>

          <div className="flex-1 ml-4 md:ml-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: showTip ? 1 : 0, x: showTip ? 0 : 20 }}
              transition={{ delay: 2 }}
              className="bg-[#1A1A40]/10 border border-[#FFD700]/20 rounded-lg p-3 mb-3"
            >
              <div className="flex items-start">
                <Lightbulb className="w-4 h-4 text-[#FFD700] mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-[#FFD700] text-xs">{getRecommendations()[0]}</p>
              </div>
            </motion.div>

            <Button
              size="sm"
              onClick={() => setShowDetails(true)}
              className="w-full bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white text-xs"
            >
              View Details
              <ArrowRight className="ml-1 w-3 h-3" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Side Panel Details - Non-blocking */}
      <AnimatePresence>
        {showDetails && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setShowDetails(false)}
            />

            {/* Side Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-y-auto"
            >
              <Card className="h-full bg-white/10 backdrop-blur-lg border-white/20 p-6 rounded-none md:rounded-l-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">Loan Readiness Details</h3>
                  <Button
                    onClick={() => setShowDetails(false)}
                    size="sm"
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Score Breakdown */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">Score Breakdown</h4>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TrendingUp className="w-4 h-4 text-emerald-400 mr-2" />
                          <span className="text-white text-sm">Sales Data</span>
                        </div>
                        <span className="text-emerald-400 font-medium">
                          {userData.salesData.reduce((sum, day) => sum + day.revenue, 0) > 0 ? "40/40" : "0/40"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-blue-400 mr-2" />
                          <span className="text-white text-sm">Inventory Value</span>
                        </div>
                        <span className="text-blue-400 font-medium">
                          {Math.min(
                            30,
                            Math.floor(
                              userData.inventoryData.reduce((sum, item) => sum + item.stock * item.price, 0) / 100,
                            ),
                          )}
                          /30
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 text-purple-400 mr-2" />
                          <span className="text-white text-sm">Cash Flow</span>
                        </div>
                        <span className="text-purple-400 font-medium">
                          {Math.min(20, userData.cashFlowData.filter((t) => t.type === "income").length * 4)}/20
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                    <h4 className="text-emerald-300 font-semibold mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {getRecommendations().map((rec, index) => (
                        <p key={index} className="text-emerald-200 text-sm">
                          • {rec}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Bilantra OS Branding */}
                  <div className="bg-[#1A1A40]/20 border border-[#FFD700]/20 rounded-lg p-4">
                    <h4 className="text-[#FFD700] font-semibold mb-2">Powered by Bilantra OS</h4>
                    <p className="text-white/70 text-sm">
                      Advanced AI algorithms analyze your business data to provide accurate loan readiness scores and
                      personalized recommendations.
                    </p>
                  </div>

                  <Button
                    onClick={() => setShowDetails(false)}
                    className="w-full bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                  >
                    Got it!
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
