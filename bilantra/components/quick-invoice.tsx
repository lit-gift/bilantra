"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Send, CheckCircle, Loader2, Download, CreditCard, Link } from "lucide-react"
import { useLanguage } from "@/app/page"

// Stripe integration (would need actual Stripe setup in production)
const createPaymentLink = async (amount: string, currency: string, description: string) => {
  // This would be a real API call to your backend that creates a Stripe payment link
  // For demo purposes, we'll simulate this
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: `https://checkout.stripe.com/pay/demo-${Date.now()}`,
        id: `pi_${Date.now()}`,
      })
    }, 1000)
  })
}

const currencies = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CHF: "CHF",
  CAD: "C$",
  AUD: "A$",
  NZD: "NZ$",
  ZAR: "R",
  NGN: "₦",
  KES: "KSh",
  GHS: "₵",
  EGP: "£E",
  MAD: "DH",
  TZS: "TSh",
  UGX: "USh",
  ETB: "Br",
  XOF: "CFA",
  XAF: "FCFA",
  BWP: "P",
  MUR: "₨",
  TND: "د.ت",
  ZMW: "ZK",
  CNY: "¥",
  INR: "₹",
  KRW: "₩",
  SGD: "S$",
  HKD: "HK$",
  THB: "฿",
  MYR: "RM",
  IDR: "Rp",
  PHP: "₱",
  VND: "₫",
  PKR: "₨",
  BDT: "৳",
  LKR: "₨",
  AED: "د.إ",
  SAR: "﷼",
  QAR: "﷼",
  KWD: "د.ك",
  BHD: ".د.ب",
  OMR: "﷼",
  JOD: "د.ا",
  LBP: "ل.ل",
  ILS: "₪",
  IRR: "﷼",
  TRY: "₺",
  BRL: "R$",
  MXN: "$",
  ARS: "$",
  CLP: "$",
  COP: "$",
  PEN: "S/",
  UYU: "$U",
  BOB: "Bs",
  PYG: "₲",
  NOK: "kr",
  SEK: "kr",
  DKK: "kr",
  PLN: "zł",
  CZK: "Kč",
  HUF: "Ft",
  RON: "lei",
  BGN: "лв",
  HRK: "kn",
  RSD: "дин",
  RUB: "₽",
  UAH: "₴",
  ISK: "kr",
  ALL: "L",
  MKD: "ден",
  BAM: "KM",
}

interface UserData {
  profile: any
  salesData: any[]
  cashFlowData: any[]
  inventoryData: any[]
  currency: string
  language: string
  lastActivity: number
}

interface QuickInvoiceProps {
  userData: UserData
}

export function QuickInvoice({ userData }: QuickInvoiceProps) {
  const [amount, setAmount] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [description, setDescription] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [paymentLink, setPaymentLink] = useState("")
  const [isCreatingPayment, setIsCreatingPayment] = useState(false)
  const { t } = useLanguage()

  const currencySymbol = currencies[userData.currency as keyof typeof currencies] || "$"

  const handleGenerate = async () => {
    if (!amount || !clientName) return

    setIsGenerating(true)

    // Generate invoice number
    const invoiceNum = `BIL-${Date.now().toString().slice(-6)}`
    setInvoiceNumber(invoiceNum)

    // Simulate invoice generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsGenerating(false)
    setIsComplete(true)

    // Reset after 10 seconds
    setTimeout(() => {
      setIsComplete(false)
      setAmount("")
      setClientName("")
      setClientEmail("")
      setDescription("")
      setInvoiceNumber("")
      setPaymentLink("")
    }, 10000)
  }

  const handleCreatePaymentLink = async () => {
    if (!amount || !clientEmail) return

    setIsCreatingPayment(true)

    try {
      const payment = await createPaymentLink(amount, userData.currency, description || "Invoice Payment")
      setPaymentLink(payment.url)
    } catch (error) {
      console.error("Failed to create payment link:", error)
    }

    setIsCreatingPayment(false)
  }

  const handleDownload = () => {
    // Enhanced PDF generation with Bilantra OS branding
    const invoiceContent = `
BILANTRA OS - INVOICE

Invoice #: ${invoiceNumber}
Date: ${new Date().toLocaleDateString()}

From:
${userData.profile.businessName}
${userData.profile.city || "City, Country"}
${userData.profile.email || "contact@business.com"}

To:
${clientName}
${clientEmail || ""}

Description: ${description || "Services Rendered"}
Amount: ${currencySymbol}${Number.parseFloat(amount).toFixed(2)}

Total: ${currencySymbol}${Number.parseFloat(amount).toFixed(2)}

Payment Link: ${paymentLink || "N/A"}

Thank you for your business!
Powered by Bilantra OS - Advanced Business Management Platform
    `

    const element = document.createElement("a")
    const file = new Blob([invoiceContent], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `bilantra-invoice-${invoiceNumber}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const copyPaymentLink = () => {
    if (paymentLink) {
      navigator.clipboard.writeText(paymentLink)
    }
  }

  return (
    <Card className="p-4 md:p-6 bg-white/10 backdrop-blur-lg border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">{t("quickInvoice")}</h3>
        <FileText className="w-5 h-5 text-emerald-400" />
      </div>

      <AnimatePresence mode="wait">
        {!isComplete ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <Input
              placeholder={t("clientName") || "Client Name"}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
            />

            <Input
              type="email"
              placeholder="Client Email (for payment link)"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
            />

            <div className="relative">
              <span className="absolute left-3 top-3 text-white/60">{currencySymbol}</span>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
              />
            </div>

            <Input
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-emerald-400 focus:ring-emerald-400/20"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                onClick={handleGenerate}
                disabled={!amount || !clientName || isGenerating}
                className="bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 disabled:opacity-50 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Generate Invoice
                  </>
                )}
              </Button>

              <Button
                onClick={handleCreatePaymentLink}
                disabled={!amount || !clientEmail || isCreatingPayment}
                variant="outline"
                className="border-[#FFD700]/30 text-[#FFD700] hover:bg-[#FFD700]/10"
              >
                {isCreatingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Link
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto mb-4 bg-emerald-500 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h4
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-white font-semibold mb-2"
            >
              Invoice Generated!
            </motion.h4>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/70 text-sm mb-4"
            >
              {invoiceNumber} • {currencySymbol}
              {amount}
            </motion.p>

            {paymentLink && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg"
              >
                <p className="text-emerald-300 text-sm mb-2">Payment Link Created!</p>
                <Button onClick={copyPaymentLink} size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                  <Link className="w-3 h-3 mr-1" />
                  Copy Link
                </Button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col md:flex-row gap-2"
            >
              <Button
                onClick={handleDownload}
                size="sm"
                className="bg-[#1A1A40] hover:bg-[#1A1A40]/80 text-[#FFD700] border border-[#FFD700]/20"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>

              {paymentLink && (
                <Button
                  onClick={() => window.open(paymentLink, "_blank")}
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                >
                  <CreditCard className="w-3 h-3 mr-1" />
                  Pay Now
                </Button>
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/50 text-xs mt-3"
            >
              Powered by Bilantra OS
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
