"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DollarSign, ChevronDown } from "lucide-react"
import { useLanguage } from "@/app/page"

interface CurrencySelectorProps {
  currentCurrency: string
  onCurrencyChange: (currency: string) => void
}

const currencies = [
  // Major World Currencies
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },

  // African Currencies
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "EGP", symbol: "£E", name: "Egyptian Pound" },
  { code: "MAD", symbol: "DH", name: "Moroccan Dirham" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  { code: "XOF", symbol: "CFA", name: "West African CFA Franc" },
  { code: "XAF", symbol: "FCFA", name: "Central African CFA Franc" },
  { code: "BWP", symbol: "P", name: "Botswana Pula" },
  { code: "MUR", symbol: "₨", name: "Mauritian Rupee" },
  { code: "TND", symbol: "د.ت", name: "Tunisian Dinar" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },

  // Asian Currencies
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "LKR", symbol: "₨", name: "Sri Lankan Rupee" },

  // Middle Eastern Currencies
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "QAR", symbol: "﷼", name: "Qatari Riyal" },
  { code: "KWD", symbol: "د.ك", name: "Kuwaiti Dinar" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial" },
  { code: "JOD", symbol: "د.ا", name: "Jordanian Dinar" },
  { code: "LBP", symbol: "ل.ل", name: "Lebanese Pound" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },

  // Latin American Currencies
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol" },
  { code: "UYU", symbol: "$U", name: "Uruguayan Peso" },
  { code: "BOB", symbol: "Bs", name: "Bolivian Boliviano" },
  { code: "PYG", symbol: "₲", name: "Paraguayan Guarani" },

  // European Currencies (Non-Euro)
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna" },
  { code: "RSD", symbol: "дин", name: "Serbian Dinar" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },

  // Other Notable Currencies
  { code: "ISK", symbol: "kr", name: "Icelandic Krona" },
  { code: "ALL", symbol: "L", name: "Albanian Lek" },
  { code: "MKD", symbol: "ден", name: "Macedonian Denar" },
  { code: "BAM", symbol: "KM", name: "Bosnia-Herzegovina Convertible Mark" },
]

export function CurrencySelector({ currentCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  const currentCurrencyData = currencies.find((c) => c.code === currentCurrency) || currencies[0]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="fixed top-4 left-4 z-40"
    >
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-300 flex items-center space-x-2"
        >
          <DollarSign className="w-4 h-4" />
          <span>
            {currentCurrencyData.symbol} {currentCurrencyData.code}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-80"
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-2 max-h-80 overflow-y-auto">
                <div className="grid grid-cols-1 gap-1">
                  {currencies.map((currency) => (
                    <motion.button
                      key={currency.code}
                      onClick={() => {
                        onCurrencyChange(currency.code)
                        setIsOpen(false)
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-white/10 ${
                        currency.code === currentCurrency ? "bg-[#1A1A40]/20 text-[#FFD700]" : "text-white"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">
                            {currency.symbol} {currency.code}
                          </span>
                          <p className="text-xs text-white/60">{currency.name}</p>
                        </div>
                        {currency.code === currentCurrency && <div className="w-2 h-2 bg-[#FFD700] rounded-full" />}
                      </div>
                    </motion.button>
                  ))}
                </div>
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
