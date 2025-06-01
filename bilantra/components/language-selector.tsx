"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Globe, ChevronDown } from "lucide-react"

interface LanguageSelectorProps {
  currentLanguage: string
  onLanguageChange: (language: string) => void
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
]

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguageData = languages.find((l) => l.code === currentLanguage) || languages[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="fixed top-4 right-20 z-40"
    >
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden md:inline">
            {currentLanguageData.flag} {currentLanguageData.name}
          </span>
          <span className="md:hidden">{currentLanguageData.flag}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-48"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-2">
                {languages.map((language) => (
                  <motion.button
                    key={language.code}
                    onClick={() => {
                      onLanguageChange(language.code)
                      setIsOpen(false)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-white/10 ${
                      language.code === currentLanguage ? "bg-[#1A1A40]/20 text-[#FFD700]" : "text-white"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="mr-2 text-lg">{language.flag}</span>
                        <span className="font-medium">{language.name}</span>
                      </div>
                      {language.code === currentLanguage && <div className="w-2 h-2 bg-[#FFD700] rounded-full" />}
                    </div>
                  </motion.button>
                ))}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />}
    </motion.div>
  )
}
