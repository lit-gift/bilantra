"use client"

import { motion } from "framer-motion"
import { DollarSign, Package, Bot, CreditCard, Home, LogOut, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/app/page"
import Image from "next/image"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onViewChange: (view: "dashboard" | "loan-analyzer") => void
  onLogout: () => void
  themeMode: "light" | "dark"
  onThemeToggle: () => void
  userProfile: {
    businessName: string
    ownerName: string
    email: string
    city: string
  }
}

export function Navigation({
  activeTab,
  onTabChange,
  onViewChange,
  onLogout,
  themeMode,
  onThemeToggle,
  userProfile,
}: NavigationProps) {
  const { t } = useLanguage()

  const tabs = [
    { id: "overview", label: t("overview"), icon: Home },
    { id: "cash-flow", label: t("cashFlow"), icon: DollarSign },
    { id: "inventory", label: t("inventory"), icon: Package },
    { id: "ai-assistant", label: t("aiAssistant"), icon: Bot },
    { id: "loan-center", label: t("loanCenter"), icon: CreditCard },
  ]

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId)
    if (tabId === "loan-center") {
      onViewChange("loan-analyzer")
    } else {
      onViewChange("dashboard")
    }
  }

  return (
    <>
      {/* Top Bar with User Info and Controls */}
      <motion.div
        className={`fixed top-0 right-0 left-0 ${
          themeMode === "dark" ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-gray-200/50"
        } backdrop-blur-lg border-b z-40 px-4 py-2`}
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 relative">
              <Image src="/images/bilantra-logo.png" alt="Bilantra" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <p className={`text-sm font-medium ${themeMode === "dark" ? "text-white" : "text-gray-900"}`}>
                {userProfile.businessName}
              </p>
              <p className={`text-xs ${themeMode === "dark" ? "text-white/60" : "text-gray-600"}`}>
                {userProfile.ownerName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={onThemeToggle}
              size="sm"
              variant="ghost"
              className={`${
                themeMode === "dark"
                  ? "text-white/60 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {themeMode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              onClick={onLogout}
              size="sm"
              variant="ghost"
              className={`${
                themeMode === "dark"
                  ? "text-white/60 hover:text-white hover:bg-white/10"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Bottom Navigation - Mobile Optimized */}
      <motion.nav
        className={`fixed bottom-0 left-0 right-0 ${
          themeMode === "dark" ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-gray-200/50"
        } backdrop-blur-lg border-t z-50`}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex justify-around items-center py-2 px-2 md:px-4 max-w-7xl mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            return (
              <motion.button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="relative flex flex-col items-center py-2 px-2 md:px-3 rounded-xl transition-all duration-300 min-w-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isActive && (
                  <motion.div
                    className={`absolute inset-0 ${themeMode === "dark" ? "bg-blue-500/20" : "bg-blue-100"} rounded-xl`}
                    layoutId="activeTab"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                <motion.div
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive
                      ? themeMode === "dark"
                        ? "text-blue-400"
                        : "text-blue-600"
                      : themeMode === "dark"
                        ? "text-white/60"
                        : "text-gray-600"
                  }`}
                  animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5 mb-1" />
                </motion.div>

                <span
                  className={`text-xs transition-colors duration-300 truncate max-w-full ${
                    isActive
                      ? themeMode === "dark"
                        ? "text-blue-400"
                        : "text-blue-600"
                      : themeMode === "dark"
                        ? "text-white/60"
                        : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </span>

                {isActive && (
                  <motion.div
                    className={`absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 ${
                      themeMode === "dark" ? "bg-blue-400" : "bg-blue-600"
                    } rounded-full`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </motion.nav>
    </>
  )
}
