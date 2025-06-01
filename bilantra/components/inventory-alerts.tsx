"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, X, Package, AlertTriangle, CheckCircle, Settings } from "lucide-react"
import { useLanguage } from "@/app/page"

interface UserData {
  profile: any
  salesData: any[]
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

interface InventoryAlertsProps {
  userData: UserData
  onUpdateData: (updates: Partial<UserData>) => void
}

interface Alert {
  id: number
  type: "low_stock" | "critical_stock" | "reorder" | "price_change"
  itemId: number
  itemName: string
  message: string
  severity: "low" | "medium" | "high"
  timestamp: Date
  read: boolean
}

export function InventoryAlerts({ userData, onUpdateData }: InventoryAlertsProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [showAlerts, setShowAlerts] = useState(false)
  const [alertSettings, setAlertSettings] = useState({
    lowStockEnabled: true,
    criticalStockEnabled: true,
    reorderEnabled: true,
    priceChangeEnabled: false,
  })
  const { t } = useLanguage()

  // Generate alerts based on inventory data
  useEffect(() => {
    const newAlerts: Alert[] = []
    let alertId = 1

    userData.inventoryData.forEach((item) => {
      if (alertSettings.criticalStockEnabled && item.stock === 0) {
        newAlerts.push({
          id: alertId++,
          type: "critical_stock",
          itemId: item.id,
          itemName: item.name,
          message: `${item.name} is out of stock!`,
          severity: "high",
          timestamp: new Date(),
          read: false,
        })
      } else if (alertSettings.lowStockEnabled && item.stock <= item.minStock && item.stock > 0) {
        newAlerts.push({
          id: alertId++,
          type: "low_stock",
          itemId: item.id,
          itemName: item.name,
          message: `${item.name} is running low (${item.stock} left)`,
          severity: "medium",
          timestamp: new Date(),
          read: false,
        })
      }

      if (alertSettings.reorderEnabled && item.stock <= item.minStock * 0.5) {
        newAlerts.push({
          id: alertId++,
          type: "reorder",
          itemId: item.id,
          itemName: item.name,
          message: `Consider reordering ${item.name}`,
          severity: "low",
          timestamp: new Date(),
          read: false,
        })
      }
    })

    setAlerts(newAlerts)
  }, [userData.inventoryData, alertSettings])

  const unreadCount = alerts.filter((alert) => !alert.read).length

  const markAsRead = (alertId: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, read: true } : alert)))
  }

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })))
  }

  const dismissAlert = (alertId: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      case "medium":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20"
      case "low":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20"
      default:
        return "text-white/60 bg-white/5 border-white/10"
    }
  }

  const getSeverityIcon = (type: string) => {
    switch (type) {
      case "critical_stock":
        return <AlertTriangle className="w-4 h-4" />
      case "low_stock":
        return <Package className="w-4 h-4" />
      case "reorder":
        return <Bell className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  return (
    <>
      {/* Alert Bell Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed top-20 right-20 z-40"
      >
        <Button
          onClick={() => setShowAlerts(true)}
          className="relative bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300 rounded-full w-12 h-12"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.div>
          )}
        </Button>
      </motion.div>

      {/* Alerts Panel */}
      <AnimatePresence>
        {showAlerts && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setShowAlerts(false)}
            />

            {/* Alerts Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md z-50 overflow-y-auto"
            >
              <Card className="h-full bg-white/10 backdrop-blur-lg border-white/20 rounded-none md:rounded-l-lg">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/20">
                  <div className="flex items-center space-x-2">
                    <Bell className="w-5 h-5 text-[#FFD700]" />
                    <h3 className="text-lg font-semibold text-white">Inventory Alerts</h3>
                    {unreadCount > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{unreadCount}</span>
                    )}
                  </div>
                  <Button
                    onClick={() => setShowAlerts(false)}
                    size="sm"
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Alert Settings */}
                <div className="p-4 border-b border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-sm font-medium">Alert Settings</span>
                    <Settings className="w-4 h-4 text-white/60" />
                  </div>
                  <div className="space-y-2">
                    {Object.entries(alertSettings).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) =>
                            setAlertSettings((prev) => ({
                              ...prev,
                              [key]: e.target.checked,
                            }))
                          }
                          className="rounded border-white/20 bg-white/10 text-[#FFD700] focus:ring-[#FFD700]/20"
                        />
                        <span className="text-white/70 text-xs">
                          {key
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())
                            .replace("Enabled", "")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {alerts.length > 0 && (
                  <div className="p-4 border-b border-white/20">
                    <Button
                      onClick={markAllAsRead}
                      size="sm"
                      className="w-full bg-[#1A1A40]/20 hover:bg-[#1A1A40]/30 text-[#FFD700] border border-[#FFD700]/30"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark All as Read
                    </Button>
                  </div>
                )}

                {/* Alerts List */}
                <div className="flex-1 overflow-y-auto">
                  {alerts.length === 0 ? (
                    <div className="p-8 text-center">
                      <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                      <h4 className="text-white font-semibold mb-2">All Good!</h4>
                      <p className="text-white/60 text-sm">No inventory alerts at the moment.</p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {alerts.map((alert) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg border transition-all duration-200 ${
                            alert.read ? "opacity-60" : ""
                          } ${getSeverityColor(alert.severity)}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="mt-0.5">{getSeverityIcon(alert.type)}</div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-white">{alert.message}</p>
                                <p className="text-xs text-white/60 mt-1">
                                  {alert.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {!alert.read && (
                                <Button
                                  onClick={() => markAsRead(alert.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-white/60 hover:text-white hover:bg-white/10 p-1"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                onClick={() => dismissAlert(alert.id)}
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white hover:bg-white/10 p-1"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/20">
                  <p className="text-white/50 text-xs text-center">Powered by Bilantra OS Smart Alerts</p>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
