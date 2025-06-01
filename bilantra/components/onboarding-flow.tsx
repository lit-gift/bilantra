"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Building2, Mail, MapPin, Lock, ArrowRight, User } from "lucide-react"
import { useLanguage } from "@/app/page"
import Image from "next/image"

interface OnboardingFlowProps {
  onComplete: (profile: any) => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    city: "",
    password: "",
    logo: null as File | null,
  })
  const { t } = useLanguage()

  const steps = [
    {
      title: t("welcome"),
      subtitle: "Your business, supercharged with AI",
      component: <WelcomeStep onNext={() => setStep(1)} />,
    },
    {
      title: "Tell us about yourself",
      subtitle: "Let's get you set up",
      component: <BusinessInfoStep formData={formData} setFormData={setFormData} onNext={() => setStep(2)} />,
    },
    {
      title: "Almost there!",
      subtitle: "Secure your account",
      component: <SecurityStep formData={formData} setFormData={setFormData} onComplete={() => onComplete(formData)} />,
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-indigo-900">
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2 mb-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`h-2 w-8 rounded-full ${i <= step ? "bg-blue-400" : "bg-white/30"}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
              <div className="text-center mb-6">
                <motion.h1
                  className="text-2xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {steps[step].title}
                </motion.h1>
                <motion.p
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {steps[step].subtitle}
                </motion.p>
              </div>
              {steps[step].component}
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  const { t } = useLanguage()

  return (
    <div className="text-center">
      <motion.div
        className="mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
      >
        <div className="w-24 h-24 mx-auto mb-4 relative">
          <Image
            src="/images/bilantra-logo.png"
            alt="Bilantra Logo"
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
      </motion.div>

      <motion.p
        className="text-gray-700 mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Empowering businesses worldwide with AI-driven insights, seamless financing, and beautiful business management.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Button
          onClick={onNext}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Get Started
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}

function BusinessInfoStep({ formData, setFormData, onNext }: any) {
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <User
            className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-300 ${
              focusedField === "owner" ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <Input
            placeholder={t("ownerName")}
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            onFocus={() => setFocusedField("owner")}
            onBlur={() => setFocusedField(null)}
            className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <div className="relative">
          <Building2
            className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-300 ${
              focusedField === "business" ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <Input
            placeholder={t("businessName")}
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            onFocus={() => setFocusedField("business")}
            onBlur={() => setFocusedField(null)}
            className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <div className="relative">
          <Mail
            className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-300 ${
              focusedField === "email" ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <Input
            type="email"
            placeholder={t("email")}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <div className="relative">
          <MapPin
            className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-300 ${
              focusedField === "city" ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <Input
            placeholder={t("city")}
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            onFocus={() => setFocusedField("city")}
            onBlur={() => setFocusedField(null)}
            className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
          />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Button
          onClick={onNext}
          disabled={!formData.businessName || !formData.ownerName || !formData.email || !formData.city}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Continue
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}

function SecurityStep({ formData, setFormData, onComplete }: any) {
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { t } = useLanguage()

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <div className="relative">
          <Lock
            className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-300 ${
              focusedField === "password" ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <Input
            type="password"
            placeholder={t("password")}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <p className="text-blue-700 text-sm">
          🔒 Your data is encrypted and secure. We use bank-level security to protect your business information.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Button
          onClick={onComplete}
          disabled={!formData.password}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Launch Bilantra
          <Image
            src="/images/bilantra-logo.png"
            alt="Bilantra"
            width={20}
            height={20}
            className="ml-2 object-contain"
          />
        </Button>
      </motion.div>
    </div>
  )
}
