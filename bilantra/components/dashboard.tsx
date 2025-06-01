"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SalesAnalytics } from "@/components/sales-analytics"
import { MicroloanWidget } from "@/components/microloan-widget"
import { QuickInvoice } from "@/components/quick-invoice"
import { CashFlowView } from "@/components/cash-flow-view"
import { InventoryView } from "@/components/inventory-view"
import { AdvancedReports } from "@/components/advanced-reports"
import { InventoryAlerts } from "@/components/inventory-alerts"
import { UserRoles } from "@/components/user-roles"
import { Integrations } from "@/components/integrations"
import { BusinessInsights } from "@/components/business-insights"
import { GoalTracking } from "@/components/goal-tracking"
import { Button } from "@/components/ui/button"
import { FileText, Users, Zap, Lightbulb, Target } from "lucide-react"
import { useLanguage } from "@/app/page"

interface UserData {
  profile: {
    businessName: string
    ownerName: string
    email: string
    city: string
    password: string
  }
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

interface DashboardProps {
  activeTab: string
  userData: UserData
  onUpdateData: (updates: Partial<UserData>) => void
}

export function Dashboard({ activeTab, userData, onUpdateData }: DashboardProps) {
  const [greeting, setGreeting] = useState("")
  const [showReports, setShowReports] = useState(false)
  const [showUserRoles, setShowUserRoles] = useState(false)
  const [showIntegrations, setShowIntegrations] = useState(false)
  const [showInsights, setShowInsights] = useState(false)
  const [showGoals, setShowGoals] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()
      let timeGreeting = ""

      if (hour < 12) {
        timeGreeting = t("goodMorning")
      } else if (hour < 17) {
        timeGreeting = t("goodAfternoon")
      } else {
        timeGreeting = t("goodEvening")
      }

      setGreeting(timeGreeting)
    }

    updateGreeting()
    const interval = setInterval(updateGreeting, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [t])

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent userData={userData} greeting={greeting} onUpdateData={onUpdateData} />
      case "cash-flow":
        return <CashFlowView userData={userData} onUpdateData={onUpdateData} />
      case "inventory":
        return <InventoryView userData={userData} onUpdateData={onUpdateData} />
      default:
        return <OverviewContent userData={userData} greeting={greeting} onUpdateData={onUpdateData} />
    }
  }

  return (
    <div className="min-h-screen pt-16 pb-20 px-4">
      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed top-20 left-4 z-30 flex flex-col space-y-2"
      >
        <Button
          onClick={() => setShowReports(true)}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <FileText className="w-4 h-4 mr-2" />
          Reports
        </Button>

        <Button
          onClick={() => setShowUserRoles(true)}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Users className="w-4 h-4 mr-2" />
          Team
        </Button>

        <Button
          onClick={() => setShowIntegrations(true)}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Zap className="w-4 h-4 mr-2" />
          Integrations
        </Button>

        <Button
          onClick={() => setShowInsights(true)}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Insights
        </Button>

        <Button
          onClick={() => setShowGoals(true)}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <Target className="w-4 h-4 mr-2" />
          Goals
        </Button>
      </motion.div>

      {/* Inventory Alerts */}
      <InventoryAlerts userData={userData} onUpdateData={onUpdateData} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Modals */}
      <AdvancedReports userData={userData} isOpen={showReports} onClose={() => setShowReports(false)} />

      <UserRoles isOpen={showUserRoles} onClose={() => setShowUserRoles(false)} currentUser={userData.profile} />

      <Integrations isOpen={showIntegrations} onClose={() => setShowIntegrations(false)} />

      <BusinessInsights userData={userData} isOpen={showInsights} onClose={() => setShowInsights(false)} />
      <GoalTracking userData={userData} isOpen={showGoals} onClose={() => setShowGoals(false)} />
    </div>
  )
}

function OverviewContent({
  userData,
  greeting,
  onUpdateData,
}: { userData: UserData; greeting: string; onUpdateData: (updates: Partial<UserData>) => void }) {
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {greeting}, {userData.profile.ownerName}! 👋
        </h1>
        <p className="text-white/70">{t("welcome")}</p>
      </motion.div>

      {/* Main Content Grid - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Sales Analytics (takes 2 columns on large screens) */}
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SalesAnalytics userData={userData} onUpdateData={onUpdateData} />
          </motion.div>
        </div>

        {/* Right Column - Loan and Invoice widgets */}
        <div className="space-y-6">
          {/* Microloan Widget */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <MicroloanWidget userData={userData} />
          </motion.div>

          {/* Quick Invoice */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <QuickInvoice userData={userData} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
