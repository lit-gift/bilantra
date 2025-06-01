"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HelpCircle, X, BarChart3, CreditCard, FileText, Bot, Zap, CheckCircle } from "lucide-react"
import Image from "next/image"

export function HowItWorks() {
  const [isOpen, setIsOpen] = useState(false)

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description:
        "Track your sales, revenue, and business growth with beautiful, interactive charts that update as you add data.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: CreditCard,
      title: "Smart Loan Matching",
      description:
        "AI analyzes your business data to match you with the best loan options from local banks and microfinance institutions.",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: FileText,
      title: "Instant Invoicing",
      description:
        "Generate professional invoices in seconds. Just enter the amount and client details - we handle the rest.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Bot,
      title: "AI Business Assistant",
      description:
        "Get personalized advice on reducing costs, improving cash flow, and growing your business with our intelligent assistant.",
      color: "from-orange-500 to-red-500",
    },
  ]

  const steps = [
    "Sign up with your business details",
    "Start tracking your daily sales and expenses",
    "Get AI-powered insights and recommendations",
    "Access financing options tailored to your business",
    "Generate invoices and manage cash flow effortlessly",
  ]

  return (
    <>
      {/* How It Works Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-4 right-4 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
        >
          <HelpCircle className="w-4 h-4 mr-2" />
          How It Works
        </Button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/images/bilantra-logo.png"
                      alt="Bilantra"
                      width={40}
                      height={40}
                      className="object-contain"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">How Bilantra Works</h2>
                      <p className="text-white/70">Empowering businesses with intelligent management</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    size="sm"
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {features.map((feature, index) => {
                    const Icon = feature.icon
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + index * 0.1 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                            <p className="text-white/70 text-sm leading-relaxed">{feature.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Steps */}
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Getting Started is Simple</h3>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-white/80">{step}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-lg p-4 border border-blue-500/20"
                >
                  <h3 className="text-white font-semibold mb-3 flex items-center">
                    <Zap className="w-5 h-5 text-blue-400 mr-2" />
                    Why Choose Bilantra?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      "Built for businesses worldwide",
                      "Works on slow internet connections",
                      "Supports multiple payment methods",
                      "AI trained on global business data",
                      "Multi-language support",
                      "Bank-level security and encryption",
                    ].map((benefit, index) => (
                      <motion.div
                        key={benefit}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.05 }}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-white/80 text-sm">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-center mt-6"
                >
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold"
                  >
                    Start Your Free Trial
                    <Zap className="w-5 h-5 ml-2" />
                  </Button>
                  <p className="text-white/60 text-sm mt-2">No credit card required • Setup in under 5 minutes</p>
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
