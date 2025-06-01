"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpRight, ArrowDownRight, DollarSign, Calendar, Plus, Trash2 } from "lucide-react"

const currencies = {
  USD: "$",
  KES: "KSh",
  NGN: "₦",
  GHS: "₵",
  ZAR: "R",
  EGP: "£E",
  MAD: "DH",
  TZS: "TSh",
  UGX: "USh",
  ETB: "Br",
  XOF: "CFA",
  EUR: "€",
  GBP: "£",
}

interface UserData {
  profile: any
  salesData: any[]
  cashFlowData: Array<{
    id: number
    type: "income" | "expense"
    amount: number
    description: string
    date: string
    time: string
  }>
  inventoryData: any[]
  currency: string
  lastActivity: number
}

interface CashFlowViewProps {
  userData: UserData
  onUpdateData: (updates: Partial<UserData>) => void
}

export function CashFlowView({ userData, onUpdateData }: CashFlowViewProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    type: "income" as "income" | "expense",
    amount: "",
    description: "",
  })

  const currencySymbol = currencies[userData.currency as keyof typeof currencies] || "$"

  const totalIncome = userData.cashFlowData.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = userData.cashFlowData.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const netFlow = totalIncome - totalExpenses

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.description) return

    const transaction = {
      id: Date.now(),
      type: newTransaction.type,
      amount: Number.parseFloat(newTransaction.amount),
      description: newTransaction.description,
      date: "Today",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    const updatedCashFlowData = [transaction, ...userData.cashFlowData]
    onUpdateData({ cashFlowData: updatedCashFlowData })

    setNewTransaction({ type: "income", amount: "", description: "" })
    setShowAddForm(false)
  }

  const handleDeleteTransaction = (id: number) => {
    const updatedCashFlowData = userData.cashFlowData.filter((t) => t.id !== id)
    onUpdateData({ cashFlowData: updatedCashFlowData })
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Cash Flow</h2>
        <p className="text-white/70">Track your money movement</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4 bg-emerald-500/10 border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-300 text-sm">Income</span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-emerald-400">
              {currencySymbol}
              {totalIncome.toLocaleString()}
            </p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-4 bg-red-500/10 border-red-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-300 text-sm">Expenses</span>
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            </div>
            <p className="text-xl font-bold text-red-400">
              {currencySymbol}
              {totalExpenses.toLocaleString()}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Net Flow */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="p-4 bg-white/10 backdrop-blur-lg border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-emerald-400 mr-2" />
              <span className="text-white">Net Flow</span>
            </div>
            <span className={`text-xl font-bold ${netFlow >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {netFlow >= 0 ? "+" : ""}
              {currencySymbol}
              {netFlow.toLocaleString()}
            </span>
          </div>
        </Card>
      </motion.div>

      {/* Add Transaction Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </Button>
      </motion.div>

      {/* Add Transaction Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 bg-white/10 backdrop-blur-lg border-white/20">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => setNewTransaction({ ...newTransaction, type: "income" })}
                    className={`${newTransaction.type === "income" ? "bg-emerald-500" : "bg-white/10"} text-white`}
                  >
                    Income
                  </Button>
                  <Button
                    onClick={() => setNewTransaction({ ...newTransaction, type: "expense" })}
                    className={`${newTransaction.type === "expense" ? "bg-red-500" : "bg-white/10"} text-white`}
                  >
                    Expense
                  </Button>
                </div>

                <Input
                  type="number"
                  placeholder="Amount"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />

                <Input
                  placeholder="Description"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />

                <div className="flex space-x-2">
                  <Button
                    onClick={handleAddTransaction}
                    disabled={!newTransaction.amount || !newTransaction.description}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Add
                  </Button>
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions List */}
      {userData.cashFlowData.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-4 bg-white/10 backdrop-blur-lg border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>

            <div className="space-y-3">
              {userData.cashFlowData.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        transaction.type === "income"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{transaction.description}</p>
                      <div className="flex items-center text-white/60 text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {transaction.date} • {transaction.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-semibold ${transaction.type === "income" ? "text-emerald-400" : "text-red-400"}`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {currencySymbol}
                      {transaction.amount.toLocaleString()}
                    </span>

                    <Button
                      onClick={() => handleDeleteTransaction(transaction.id)}
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 text-center">
            <DollarSign className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No Transactions Yet</h3>
            <p className="text-white/60 text-sm mb-4">Start tracking your income and expenses to see your cash flow</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Transaction
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
