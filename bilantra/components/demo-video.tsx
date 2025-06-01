"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, X, Maximize2 } from "lucide-react"

interface DemoVideoProps {
  onClose: () => void
}

export function DemoVideo({ onClose }: DemoVideoProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const totalDuration = 30 // 30 seconds

  // Demo sequence states
  const [demoStep, setDemoStep] = useState(0)
  const [showLogin, setShowLogin] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showLoanWidget, setShowLoanWidget] = useState(false)
  const [showInvoice, setShowInvoice] = useState(false)
  const [showAI, setShowAI] = useState(false)

  // Auto-play demo sequence
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        const newTime = prev + 0.1

        // Demo sequence timing
        if (newTime >= 3 && newTime < 8) {
          setShowLogin(false)
          setShowDashboard(true)
          setDemoStep(1)
        } else if (newTime >= 8 && newTime < 13) {
          setShowAnalytics(true)
          setDemoStep(2)
        } else if (newTime >= 13 && newTime < 18) {
          setShowLoanWidget(true)
          setDemoStep(3)
        } else if (newTime >= 18 && newTime < 23) {
          setShowInvoice(true)
          setDemoStep(4)
        } else if (newTime >= 23 && newTime < 28) {
          setShowAI(true)
          setDemoStep(5)
        } else if (newTime >= 30) {
          // Reset demo
          setCurrentTime(0)
          setShowLogin(true)
          setShowDashboard(false)
          setShowAnalytics(false)
          setShowLoanWidget(false)
          setShowInvoice(false)
          setShowAI(false)
          setDemoStep(0)
          return 0
        }

        return newTime
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const progressPercentage = (currentTime / totalDuration) * 100

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -400, opacity: 0 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`fixed left-4 top-4 z-50 ${isFullscreen ? "inset-0 left-0 top-0" : "w-80 h-96"}`}
    >
      <Card className="h-full bg-black/90 backdrop-blur-lg border-white/20 overflow-hidden flex flex-col">
        {/* Video Header */}
        <div className="flex items-center justify-between p-3 bg-black/50 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Live Demo</span>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-1"
            >
              <Maximize2 className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-white/60 hover:text-white hover:bg-white/10 p-1"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Video Content */}
        <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 overflow-hidden">
          {/* Demo Content */}
          <div className="absolute inset-0 p-4">
            <AnimatePresence mode="wait">
              {showLogin && (
                <motion.div
                  key="login-demo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="w-full max-w-xs">
                    <motion.div
                      className="text-center mb-4"
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">AS</span>
                      </div>
                      <h3 className="text-white font-semibold text-sm">AfriSME OS</h3>
                    </motion.div>

                    <motion.div
                      className="space-y-3"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="h-8 bg-white/10 rounded border border-white/20 flex items-center px-3">
                        <span className="text-white/60 text-xs">sarah@coffeeshop.com</span>
                      </div>
                      <div className="h-8 bg-white/10 rounded border border-white/20 flex items-center px-3">
                        <span className="text-white/60 text-xs">••••••••</span>
                      </div>
                      <motion.div
                        className="h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                      >
                        <span className="text-white text-xs font-medium">Sign In</span>
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {showDashboard && (
                <motion.div
                  key="dashboard-demo"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="h-full overflow-y-auto"
                >
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-4"
                  >
                    <h3 className="text-white font-semibold text-sm">Good morning, Sarah! 👋</h3>
                    <p className="text-white/60 text-xs">Your business is growing +12%</p>
                  </motion.div>

                  <div className="space-y-3">
                    {showAnalytics && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 rounded-lg p-3 border border-white/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white text-xs font-medium">Weekly Revenue</span>
                          <span className="text-emerald-400 text-xs">+12%</span>
                        </div>
                        <div className="text-white font-bold text-lg">$15,800</div>
                        <div className="h-16 mt-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded flex items-end justify-between px-2 pb-1">
                          {[40, 60, 50, 80, 90, 100, 85].map((height, i) => (
                            <motion.div
                              key={i}
                              className="w-2 bg-gradient-to-t from-emerald-400 to-blue-400 rounded-sm"
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: i * 0.1 }}
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {showLoanWidget && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 rounded-lg p-3 border border-white/20"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-white text-xs font-medium">Loan Readiness</span>
                            <div className="text-emerald-400 text-xs mt-1">💡 Add 2 months sales data</div>
                          </div>
                          <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="2"
                              />
                              <motion.path
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="url(#gradient)"
                                strokeWidth="2"
                                strokeDasharray="78, 100"
                                initial={{ strokeDasharray: "0, 100" }}
                                animate={{ strokeDasharray: "78, 100" }}
                                transition={{ duration: 1.5 }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-white text-xs font-bold">78%</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {showInvoice && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 rounded-lg p-3 border border-white/20"
                      >
                        <span className="text-white text-xs font-medium">Quick Invoice</span>
                        <div className="mt-2 space-y-2">
                          <div className="h-6 bg-white/10 rounded border border-white/20 flex items-center px-2">
                            <span className="text-white/60 text-xs">$250.00</span>
                          </div>
                          <motion.div
                            className="h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded flex items-center justify-center"
                            whileHover={{ scale: 1.02 }}
                          >
                            <span className="text-white text-xs">Generate Invoice</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {showAI && (
                <motion.div
                  key="ai-demo"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute bottom-4 right-4"
                >
                  <motion.div
                    className="w-32 bg-white/10 rounded-lg p-2 border border-white/20"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full mr-2"></div>
                      <span className="text-white text-xs font-medium">AI Assistant</span>
                    </div>
                    <p className="text-white/80 text-xs">
                      "Based on your data, focus on inventory turnover to improve cash flow."
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step Indicators */}
          <div className="absolute top-2 left-2 flex space-x-1">
            {[0, 1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  demoStep >= step ? "bg-emerald-400" : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* Demo Labels */}
          <div className="absolute top-2 right-2">
            <motion.span
              key={demoStep}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white/80 text-xs bg-black/50 px-2 py-1 rounded"
            >
              {demoStep === 0 && "Login Flow"}
              {demoStep === 1 && "Dashboard"}
              {demoStep === 2 && "Analytics"}
              {demoStep === 3 && "Loan Widget"}
              {demoStep === 4 && "Quick Invoice"}
              {demoStep === 5 && "AI Assistant"}
            </motion.span>
          </div>
        </div>

        {/* Video Controls */}
        <div className="p-3 bg-black/50 border-t border-white/10">
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-400 to-blue-400"
                style={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-1"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-1"
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-white/60 text-xs">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>
          </div>
        </div>

        {/* Call to Action Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: currentTime > 25 ? 1 : 0 }}
          className="absolute inset-x-0 bottom-16 p-3"
        >
          <motion.div
            className="bg-gradient-to-r from-emerald-500/90 to-blue-500/90 backdrop-blur-sm rounded-lg p-3 text-center"
            initial={{ y: 20 }}
            animate={{ y: currentTime > 25 ? 0 : 20 }}
          >
            <p className="text-white text-xs font-medium mb-2">Ready to transform your business?</p>
            <Button size="sm" onClick={onClose} className="bg-white text-emerald-600 hover:bg-white/90 text-xs px-4">
              Get Started Now
            </Button>
          </motion.div>
        </motion.div>
      </Card>

      {/* Video Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-3 p-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20"
      >
        <h4 className="text-white font-semibold text-sm mb-1">See AfriSME OS in Action</h4>
        <p className="text-white/70 text-xs leading-relaxed">
          Watch how Sarah manages her coffee shop with AI-powered insights, instant invoicing, and loan recommendations.
        </p>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs text-white/60">
            <span>📊 Real-time Analytics</span>
            <span>💰 Smart Financing</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 text-xs px-3 py-1"
          >
            Try It
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
