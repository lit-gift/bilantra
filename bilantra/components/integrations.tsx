"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Zap,
  X,
  Settings,
  Link,
  Unlink,
  CreditCard,
  ShoppingCart,
  FileText,
  BarChart3,
  Mail,
  MessageSquare,
  Cloud,
  Database,
} from "lucide-react"
import { useLanguage } from "@/app/page"

interface Integration {
  id: string
  name: string
  description: string
  category: "payment" | "ecommerce" | "accounting" | "analytics" | "communication" | "storage"
  icon: any
  connected: boolean
  config?: any
  features: string[]
  pricing: string
}

interface IntegrationsProps {
  isOpen: boolean
  onClose: () => void
}

export function Integrations({ isOpen, onClose }: IntegrationsProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "stripe",
      name: "Stripe",
      description: "Accept payments online with the world's leading payment processor",
      category: "payment",
      icon: CreditCard,
      connected: false,
      features: ["Online payments", "Subscription billing", "Global coverage", "Advanced fraud protection"],
      pricing: "2.9% + 30¢ per transaction",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Enable PayPal payments for your customers worldwide",
      category: "payment",
      icon: CreditCard,
      connected: false,
      features: ["PayPal payments", "Express checkout", "Buyer protection", "Mobile payments"],
      pricing: "2.9% + fixed fee",
    },
    {
      id: "shopify",
      name: "Shopify",
      description: "Sync your Shopify store with Bilantra OS for unified management",
      category: "ecommerce",
      icon: ShoppingCart,
      connected: false,
      features: ["Product sync", "Order management", "Inventory sync", "Customer data"],
      pricing: "Free with Shopify plan",
    },
    {
      id: "woocommerce",
      name: "WooCommerce",
      description: "Connect your WordPress WooCommerce store",
      category: "ecommerce",
      icon: ShoppingCart,
      connected: false,
      features: ["Product sync", "Order tracking", "Customer management", "Sales analytics"],
      pricing: "Free",
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Sync your accounting data with QuickBooks Online",
      category: "accounting",
      icon: FileText,
      connected: false,
      features: ["Financial sync", "Invoice management", "Expense tracking", "Tax preparation"],
      pricing: "Starting at $25/month",
    },
    {
      id: "xero",
      name: "Xero",
      description: "Beautiful accounting software for small businesses",
      category: "accounting",
      icon: FileText,
      connected: false,
      features: ["Bank reconciliation", "Invoice automation", "Financial reporting", "Multi-currency"],
      pricing: "Starting at $13/month",
    },
    {
      id: "google-analytics",
      name: "Google Analytics",
      description: "Track website and business performance with Google Analytics",
      category: "analytics",
      icon: BarChart3,
      connected: false,
      features: ["Website analytics", "E-commerce tracking", "Custom reports", "Real-time data"],
      pricing: "Free",
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      description: "Email marketing and automation platform",
      category: "communication",
      icon: Mail,
      connected: false,
      features: ["Email campaigns", "Customer segmentation", "Automation", "Analytics"],
      pricing: "Free up to 2,000 contacts",
    },
    {
      id: "slack",
      name: "Slack",
      description: "Get business notifications and updates in Slack",
      category: "communication",
      icon: MessageSquare,
      connected: false,
      features: ["Real-time notifications", "Team collaboration", "Custom alerts", "File sharing"],
      pricing: "Free for basic features",
    },
    {
      id: "google-drive",
      name: "Google Drive",
      description: "Store and sync your business documents with Google Drive",
      category: "storage",
      icon: Cloud,
      connected: false,
      features: ["Document storage", "File sync", "Collaboration", "Backup"],
      pricing: "15GB free, then $1.99/month",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Cloud storage and file synchronization service",
      category: "storage",
      icon: Cloud,
      connected: false,
      features: ["File storage", "Team folders", "Version history", "Mobile access"],
      pricing: "2GB free, then $9.99/month",
    },
    {
      id: "airtable",
      name: "Airtable",
      description: "Organize your business data with the power of a database",
      category: "storage",
      icon: Database,
      connected: false,
      features: ["Database management", "Custom views", "Collaboration", "API access"],
      pricing: "Free for personal use",
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const { t } = useLanguage()

  const categories = [
    { id: "all", name: "All", icon: Zap },
    { id: "payment", name: "Payments", icon: CreditCard },
    { id: "ecommerce", name: "E-commerce", icon: ShoppingCart },
    { id: "accounting", name: "Accounting", icon: FileText },
    { id: "analytics", name: "Analytics", icon: BarChart3 },
    { id: "communication", name: "Communication", icon: Mail },
    { id: "storage", name: "Storage", icon: Cloud },
  ]

  const filteredIntegrations =
    selectedCategory === "all"
      ? integrations
      : integrations.filter((integration) => integration.category === selectedCategory)

  const handleConnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) => (integration.id === integrationId ? { ...integration, connected: true } : integration)),
    )
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, connected: false } : integration,
      ),
    )
  }

  const handleConfigure = (integration: Integration) => {
    setSelectedIntegration(integration)
    setShowConfig(true)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "payment":
        return "from-green-500 to-emerald-500"
      case "ecommerce":
        return "from-blue-500 to-cyan-500"
      case "accounting":
        return "from-purple-500 to-pink-500"
      case "analytics":
        return "from-orange-500 to-red-500"
      case "communication":
        return "from-indigo-500 to-blue-500"
      case "storage":
        return "from-gray-500 to-slate-500"
      default:
        return "from-[#1A1A40] to-[#FFD700]"
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
                  <h2 className="text-2xl font-bold text-white mb-2">Integrations</h2>
                  <p className="text-white/70">Connect Bilantra OS with your favorite tools</p>
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
                {/* Categories Sidebar */}
                <div className="w-64 border-r border-white/20 p-4">
                  <h3 className="text-white font-semibold mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => {
                      const Icon = category.icon
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                            selectedCategory === category.id
                              ? "bg-[#1A1A40]/20 text-[#FFD700]"
                              : "text-white hover:bg-white/10"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{category.name}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Connected Count */}
                  <div className="mt-6 p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Connected</span>
                      <span className="text-[#FFD700] font-semibold">
                        {integrations.filter((i) => i.connected).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-white/60 text-sm">Available</span>
                      <span className="text-white font-semibold">{integrations.length}</span>
                    </div>
                  </div>
                </div>

                {/* Integrations Grid */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIntegrations.map((integration) => {
                      const Icon = integration.icon
                      return (
                        <motion.div
                          key={integration.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${getCategoryColor(integration.category)} flex items-center justify-center`}
                              >
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-white font-semibold">{integration.name}</h3>
                                <span className="text-white/60 text-xs capitalize">{integration.category}</span>
                              </div>
                            </div>
                            {integration.connected && <div className="w-2 h-2 bg-emerald-400 rounded-full" />}
                          </div>

                          <p className="text-white/70 text-sm mb-4 line-clamp-2">{integration.description}</p>

                          <div className="mb-4">
                            <h4 className="text-white text-xs font-medium mb-2">Features:</h4>
                            <div className="space-y-1">
                              {integration.features.slice(0, 2).map((feature, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-1 h-1 bg-[#FFD700] rounded-full" />
                                  <span className="text-white/60 text-xs">{feature}</span>
                                </div>
                              ))}
                              {integration.features.length > 2 && (
                                <span className="text-white/50 text-xs">+{integration.features.length - 2} more</span>
                              )}
                            </div>
                          </div>

                          <div className="mb-4">
                            <span className="text-white/60 text-xs">Pricing: </span>
                            <span className="text-white text-xs">{integration.pricing}</span>
                          </div>

                          <div className="flex space-x-2">
                            {integration.connected ? (
                              <>
                                <Button
                                  onClick={() => handleConfigure(integration)}
                                  size="sm"
                                  className="flex-1 bg-[#1A1A40]/20 hover:bg-[#1A1A40]/30 text-[#FFD700] border border-[#FFD700]/30"
                                >
                                  <Settings className="w-3 h-3 mr-1" />
                                  Configure
                                </Button>
                                <Button
                                  onClick={() => handleDisconnect(integration.id)}
                                  size="sm"
                                  variant="outline"
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                >
                                  <Unlink className="w-3 h-3" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                onClick={() => handleConnect(integration.id)}
                                size="sm"
                                className="w-full bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                              >
                                <Link className="w-3 h-3 mr-1" />
                                Connect
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Configuration Modal */}
              <AnimatePresence>
                {showConfig && selectedIntegration && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowConfig(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-full max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-white">Configure {selectedIntegration.name}</h3>
                          <Button
                            onClick={() => setShowConfig(false)}
                            size="sm"
                            variant="ghost"
                            className="text-white/60 hover:text-white hover:bg-white/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {selectedIntegration.category === "payment" && (
                            <>
                              <Input
                                placeholder="API Key"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              />
                              <Input
                                placeholder="Secret Key"
                                type="password"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              />
                            </>
                          )}

                          {selectedIntegration.category === "ecommerce" && (
                            <>
                              <Input
                                placeholder="Store URL"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              />
                              <Input
                                placeholder="API Token"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              />
                            </>
                          )}

                          {selectedIntegration.category === "accounting" && (
                            <>
                              <Input
                                placeholder="Company ID"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              />
                              <Input
                                placeholder="Access Token"
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              />
                            </>
                          )}

                          <div className="flex space-x-2">
                            <Button
                              onClick={() => setShowConfig(false)}
                              className="flex-1 bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                            >
                              Save Configuration
                            </Button>
                            <Button
                              onClick={() => setShowConfig(false)}
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
