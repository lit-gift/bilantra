"use client"

// Create a new component for theme toggle functionality

import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"

interface ThemeToggleProps {
  theme: "light" | "dark"
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-20 right-4 z-40"
    >
      <Button
        onClick={onToggle}
        size="icon"
        className={`rounded-full w-10 h-10 ${
          theme === "dark"
            ? "bg-[#1A1A40] text-[#FFD700] hover:bg-[#1A1A40]/80"
            : "bg-[#FFD700] text-[#1A1A40] hover:bg-[#FFD700]/80"
        }`}
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>
    </motion.div>
  )
}
