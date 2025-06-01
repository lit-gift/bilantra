"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Bot, Send, X, Mic, MessageCircle } from "lucide-react"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content: "Hi! I'm your AI business assistant. How can I help you reduce costs or grow your business today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ])

  const suggestions = ["How to reduce costs?", "Improve cash flow", "Marketing strategies", "Inventory optimization"]

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "ai",
        content:
          "Based on your business data, I recommend focusing on inventory turnover and digital marketing. Would you like specific strategies for either?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { scale: 0 } : { scale: 1 }}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 right-4 w-80 h-96 z-50"
          >
            <Card className="h-full bg-white/10 backdrop-blur-lg border-white/20 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
                    <p className="text-white/60 text-xs">Online</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === "user"
                          ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                          : "bg-white/10 text-white"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.type === "user" ? "text-white/80" : "text-white/60"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </motion.div>
                ))}

                {/* Suggestions */}
                {messages.length === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-2"
                  >
                    <p className="text-white/60 text-xs">Quick suggestions:</p>
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        onClick={() => setMessage(suggestion)}
                        className="block w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-sm transition-colors"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex items-center space-x-2">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
