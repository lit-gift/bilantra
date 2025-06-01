"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Mail, Lock, AlertCircle } from "lucide-react"
import Image from "next/image"

interface LoginFormProps {
  onLogin: (email: string, password: string) => boolean
  onSignUp: () => void
}

export function LoginForm({ onLogin, onSignUp }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleLogin = () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    const success = onLogin(email, password)
    if (!success) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-900 to-indigo-900">
      <motion.div
        className="w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl">
          <div className="text-center mb-6">
            <motion.div
              className="w-20 h-20 mx-auto mb-4 relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <Image
                src="/images/bilantra-logo.png"
                alt="Bilantra Logo"
                width={80}
                height={80}
                className="object-contain"
              />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your Bilantra account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
            >
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </motion.div>
          )}

          <div className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <div className="relative">
                <Mail
                  className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "email" ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError("")
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <div className="relative">
                <Lock
                  className={`absolute left-3 top-3 w-5 h-5 transition-colors duration-300 ${
                    focusedField === "password" ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  className="pl-12 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Sign In
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="text-center">
                <span className="text-gray-600 text-sm">Don't have an account? </span>
                <Button
                  variant="link"
                  onClick={onSignUp}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
                >
                  Sign Up
                </Button>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
