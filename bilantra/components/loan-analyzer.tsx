"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Package, Home, Zap, Star, ArrowRight, Loader2 } from "lucide-react"

interface UserData {
  profile: {
    businessName: string
    ownerName: string
    email: string
    city: string
    password: string
  }
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
  lastActivity: number
}

interface LoanAnalyzerProps {
  userData: UserData
}

export function LoanAnalyzer({ userData }: LoanAnalyzerProps) {
  const [step, setStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState({
    location: userData.profile.city || "",
    inventory: "",
    assets: "",
  })

  const handleAnalyze = async () => {
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsAnalyzing(false)
    setShowResults(true)
  }

  // Function to get banks based on location
  const getBanksByLocation = (location: string) => {
    // This would ideally be an API call to get location-specific banks
    // For now, we'll simulate with different banks for different regions

    const lowerLocation = location.toLowerCase()

    if (lowerLocation.includes("kenya") || lowerLocation.includes("nairobi")) {
      return [
        { name: "KCB Bank", match: 92, rate: "12%", amount: "$5,000", time: "7 days" },
        { name: "Equity Bank", match: 89, rate: "14%", amount: "$4,500", time: "10 days" },
        { name: "NCBA Bank", match: 85, rate: "15%", amount: "$4,000", time: "5 days" },
        { name: "Cooperative Bank", match: 83, rate: "13%", amount: "$3,500", time: "14 days" },
      ]
    }

    if (lowerLocation.includes("nigeria") || lowerLocation.includes("lagos")) {
      return [
        { name: "Zenith Bank", match: 93, rate: "16%", amount: "₦1,800,000", time: "9 days" },
        { name: "Access Bank", match: 90, rate: "17%", amount: "₦1,500,000", time: "5 days" },
        { name: "GTBank", match: 87, rate: "15%", amount: "₦1,350,000", time: "8 days" },
        { name: "FirstBank", match: 82, rate: "16.5%", amount: "₦1,200,000", time: "12 days" },
      ]
    }

    if (lowerLocation.includes("ghana") || lowerLocation.includes("accra")) {
      return [
        { name: "Ecobank", match: 91, rate: "15%", amount: "₵30,000", time: "6 days" },
        { name: "Fidelity Bank", match: 88, rate: "16%", amount: "₵25,000", time: "8 days" },
        { name: "GCB Bank", match: 86, rate: "14%", amount: "₵28,000", time: "10 days" },
        { name: "Stanbic Bank", match: 83, rate: "15.5%", amount: "₵22,000", time: "7 days" },
      ]
    }

    if (lowerLocation.includes("south africa") || lowerLocation.includes("johannesburg")) {
      return [
        { name: "Standard Bank", match: 94, rate: "11%", amount: "R80,000", time: "5 days" },
        { name: "FNB", match: 91, rate: "12%", amount: "R75,000", time: "8 days" },
        { name: "Absa", match: 88, rate: "12.5%", amount: "R70,000", time: "6 days" },
        { name: "Nedbank", match: 85, rate: "13%", amount: "R65,000", time: "9 days" },
      ]
    }

    // Default fallback for other locations
    return [
      { name: "Global SME Bank", match: 87, rate: "14%", amount: "$4,000", time: "10 days" },
      { name: "International Finance", match: 85, rate: "15%", amount: "$3,800", time: "12 days" },
      { name: "Regional Trust", match: 82, rate: "13%", amount: "$3,500", time: "15 days" },
      { name: "Local MicroCredit", match: 80, rate: "12%", amount: "$3,200", time: "8 days" },
    ]
  }

  // Update the lenders calculation to use location
  const [lenders, setLenders] = useState(getBanksByLocation(userData.profile.city))

  // Add a useEffect to update lenders when location changes
  useEffect(() => {
    if (formData.location) {
      setLenders(getBanksByLocation(formData.location))
    }
  }, [formData.location])

  return (
    <div className="min-h-screen pt-16 pb-20 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Loan Eligibility Analyzer</h2>
          <p className="text-white/70">AI-powered financing recommendations</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-white text-sm font-medium mb-2">Business Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-emerald-400" />
                      <Input
                        placeholder="e.g., Nairobi, Kenya"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-white text-sm font-medium mb-2">Inventory Value</label>
                    <div className="relative">
                      <Package className="absolute left-3 top-3 w-5 h-5 text-emerald-400" />
                      <Input
                        placeholder={`Current: $${userData.inventoryData.reduce((sum, item) => sum + item.stock * item.price, 0).toLocaleString()}`}
                        value={formData.inventory}
                        onChange={(e) => setFormData({ ...formData, inventory: e.target.value })}
                        className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-white text-sm font-medium mb-2">Property/Assets</label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 w-5 h-5 text-emerald-400" />
                      <Input
                        placeholder="e.g., Shop lease, equipment"
                        value={formData.assets}
                        onChange={(e) => setFormData({ ...formData, assets: e.target.value })}
                        className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={handleAnalyze}
                      disabled={!formData.location || isAnalyzing}
                      className="w-full bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 disabled:opacity-50 text-white font-semibold py-3"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <motion.span key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            Analyzing Eligibility...
                          </motion.span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Analyze Eligibility
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 mb-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-6"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#1A1A40] rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-[#FFD700]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Great News!</h3>
                  <p className="text-white/70">You're eligible for multiple loan options</p>
                </motion.div>

                <div className="space-y-4">
                  {lenders.map((lender, index) => (
                    <motion.div
                      key={lender.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{lender.name}</h4>
                        <div className="flex items-center">
                          <motion.div
                            className="w-12 h-2 bg-white/20 rounded-full overflow-hidden mr-2"
                            initial={{ width: 0 }}
                            animate={{ width: 48 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                          >
                            <motion.div
                              className="h-full bg-gradient-to-r from-[#1A1A40] to-[#FFD700]"
                              initial={{ width: "0%" }}
                              animate={{ width: `${lender.match}%` }}
                              transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                            />
                          </motion.div>
                          <span className="text-[#FFD700] font-semibold text-sm">{lender.match}%</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-white/60">Rate</p>
                          <p className="text-white font-medium">{lender.rate}</p>
                        </div>
                        <div>
                          <p className="text-white/60">Amount</p>
                          <p className="text-white font-medium">{lender.amount}</p>
                        </div>
                        <div>
                          <p className="text-white/60">Processing</p>
                          <p className="text-white font-medium">{lender.time}</p>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="w-full mt-3 bg-gradient-to-r from-[#1A1A40]/20 to-[#FFD700]/20 hover:from-[#1A1A40]/30 hover:to-[#FFD700]/30 border border-[#FFD700]/30 text-[#FFD700]"
                      >
                        Apply Now
                        <ArrowRight className="ml-1 w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <Button
                  onClick={() => {
                    setShowResults(false)
                    setFormData({ location: userData.profile.city || "", inventory: "", assets: "" })
                  }}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Analyze Again
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
