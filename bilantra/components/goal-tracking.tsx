"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from "lucide-react"
import { useLanguage } from "@/app/page"

const currencies = {
  USD: "$",
  EUR: "€",
  GBP: "£",
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
  BRL: "R$",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  AED: "د.إ",
  SAR: "﷼",
}

interface Goal {
  id: number
  title: string
  description: string
  target: number
  current: number
  type: "revenue" | "savings" | "customers" | "inventory" | "custom"
  deadline: Date
  status: "active" | "completed" | "overdue"
  createdAt: Date
  unit?: string
}

interface UserData {
  profile: any
  salesData: Array<{ day: string; revenue: number }>
  cashFlowData: any[]
  inventoryData: any[]
  currency: string
  language: string
  lastActivity: number
}

interface GoalTrackingProps {
  userData: UserData
  isOpen: boolean
  onClose: () => void
}

export function GoalTracking({ userData, isOpen, onClose }: GoalTrackingProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      title: "Monthly Revenue Target",
      description: "Reach monthly revenue target",
      target: 10000,
      current: 7500,
      type: "revenue",
      deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      status: "active",
      createdAt: new Date(),
    },
    {
      id: 2,
      title: "Emergency Fund",
      description: "Build emergency savings fund",
      target: 5000,
      current: 2000,
      type: "savings",
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months
      status: "active",
      createdAt: new Date(),
    },
  ])

  const [showAddGoal, setShowAddGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: "",
    type: "revenue" as Goal["type"],
    deadline: "",
    unit: "",
  })
  const { t } = useLanguage()

  const currencySymbol = currencies[userData.currency as keyof typeof currencies] || "$"

  // Update goal progress based on actual business data
  useEffect(() => {
    const totalRevenue = userData.salesData.reduce((sum, day) => sum + day.revenue, 0)
    const totalIncome = userData.cashFlowData.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.type === "revenue") {
          const current = totalRevenue + totalIncome
          return {
            ...goal,
            current,
            status: current >= goal.target ? "completed" : new Date() > goal.deadline ? "overdue" : "active",
          }
        }
        return goal
      }),
    )
  }, [userData.salesData, userData.cashFlowData])

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target || !newGoal.deadline) return

    const goal: Goal = {
      id: Date.now(),
      title: newGoal.title,
      description: newGoal.description,
      target: Number.parseFloat(newGoal.target),
      current: 0,
      type: newGoal.type,
      deadline: new Date(newGoal.deadline),
      status: "active",
      createdAt: new Date(),
      unit: newGoal.unit,
    }

    setGoals((prev) => [...prev, goal])
    setNewGoal({
      title: "",
      description: "",
      target: "",
      type: "revenue",
      deadline: "",
      unit: "",
    })
    setShowAddGoal(false)
  }

  const handleUpdateGoal = (goalId: number, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((goal) => (goal.id === goalId ? { ...goal, ...updates } : goal)))
  }

  const handleDeleteGoal = (goalId: number) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== goalId))
  }

  const getGoalIcon = (type: string) => {
    switch (type) {
      case "revenue":
        return <DollarSign className="w-5 h-5" />
      case "savings":
        return <Target className="w-5 h-5" />
      case "customers":
        return <Users className="w-5 h-5" />
      case "inventory":
        return <Package className="w-5 h-5" />
      default:
        return <Target className="w-5 h-5" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />
      case "overdue":
        return <AlertCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-blue-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "from-emerald-500 to-green-500"
      case "overdue":
        return "from-red-500 to-orange-500"
      default:
        return "from-blue-500 to-cyan-500"
    }
  }

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const formatValue = (value: number, type: string, unit?: string) => {
    if (type === "revenue" || type === "savings") {
      return `${currencySymbol}${value.toLocaleString()}`
    }
    return `${value.toLocaleString()}${unit ? ` ${unit}` : ""}`
  }

  const getDaysRemaining = (deadline: Date) => {
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Goal Tracking</h2>
                  <p className="text-white/70">Set and track your business objectives</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowAddGoal(true)}
                    className="bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Goal
                  </Button>
                  <Button
                    onClick={onClose}
                    size="sm"
                    variant="ghost"
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Goals Overview */}
              <div className="p-6 border-b border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm">Total Goals</p>
                        <p className="text-2xl font-bold text-white">{goals.length}</p>
                      </div>
                      <Target className="w-8 h-8 text-[#FFD700]" />
                    </div>
                  </Card>

                  <Card className="p-4 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm">Completed</p>
                        <p className="text-2xl font-bold text-emerald-400">
                          {goals.filter((g) => g.status === "completed").length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                  </Card>

                  <Card className="p-4 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm">Active</p>
                        <p className="text-2xl font-bold text-blue-400">
                          {goals.filter((g) => g.status === "active").length}
                        </p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-400" />
                    </div>
                  </Card>

                  <Card className="p-4 bg-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/60 text-sm">Overdue</p>
                        <p className="text-2xl font-bold text-red-400">
                          {goals.filter((g) => g.status === "overdue").length}
                        </p>
                      </div>
                      <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>
                  </Card>
                </div>
              </div>

              {/* Goals List */}
              <div className="flex-1 overflow-y-auto p-6">
                {goals.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-white font-semibold mb-2">No Goals Set</h3>
                    <p className="text-white/60 text-sm mb-4">
                      Set your first business goal to start tracking progress
                    </p>
                    <Button
                      onClick={() => setShowAddGoal(true)}
                      className="bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Goal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {goals.map((goal, index) => {
                      const progress = calculateProgress(goal.current, goal.target)
                      const daysRemaining = getDaysRemaining(goal.deadline)

                      return (
                        <motion.div
                          key={goal.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4">
                              <div
                                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getStatusColor(goal.status)} flex items-center justify-center flex-shrink-0`}
                              >
                                {getGoalIcon(goal.type)}
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h3 className="text-white font-semibold">{goal.title}</h3>
                                  {getStatusIcon(goal.status)}
                                </div>
                                <p className="text-white/70 text-sm mb-2">{goal.description}</p>

                                <div className="flex items-center space-x-4 text-xs text-white/60">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {daysRemaining > 0
                                        ? `${daysRemaining} days left`
                                        : daysRemaining === 0
                                          ? "Due today"
                                          : `${Math.abs(daysRemaining)} days overdue`}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="capitalize">{goal.type}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Button
                                onClick={() => setEditingGoal(goal)}
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white hover:bg-white/10"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteGoal(goal.id)}
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/60">Progress</span>
                              <span className="text-white font-medium">{progress.toFixed(1)}%</span>
                            </div>

                            <Progress value={progress} className="h-2" />

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/60">
                                {formatValue(goal.current, goal.type, goal.unit)} of{" "}
                                {formatValue(goal.target, goal.type, goal.unit)}
                              </span>
                              <span className="text-white/60">
                                {formatValue(goal.target - goal.current, goal.type, goal.unit)} remaining
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Add Goal Modal */}
              <AnimatePresence>
                {showAddGoal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowAddGoal(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-full max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Add New Goal</h3>

                        <div className="space-y-4">
                          <Input
                            placeholder="Goal Title"
                            value={newGoal.title}
                            onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />

                          <Input
                            placeholder="Description (optional)"
                            value={newGoal.description}
                            onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />

                          <select
                            value={newGoal.type}
                            onChange={(e) => setNewGoal((prev) => ({ ...prev, type: e.target.value as Goal["type"] }))}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                          >
                            <option value="revenue" className="bg-slate-800">
                              Revenue Goal
                            </option>
                            <option value="savings" className="bg-slate-800">
                              Savings Goal
                            </option>
                            <option value="customers" className="bg-slate-800">
                              Customer Goal
                            </option>
                            <option value="inventory" className="bg-slate-800">
                              Inventory Goal
                            </option>
                            <option value="custom" className="bg-slate-800">
                              Custom Goal
                            </option>
                          </select>

                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="number"
                              placeholder="Target Amount"
                              value={newGoal.target}
                              onChange={(e) => setNewGoal((prev) => ({ ...prev, target: e.target.value }))}
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                            />

                            {newGoal.type === "custom" && (
                              <Input
                                placeholder="Unit (optional)"
                                value={newGoal.unit}
                                onChange={(e) => setNewGoal((prev) => ({ ...prev, unit: e.target.value }))}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                              />
                            )}
                          </div>

                          <Input
                            type="date"
                            value={newGoal.deadline}
                            onChange={(e) => setNewGoal((prev) => ({ ...prev, deadline: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white"
                          />

                          <div className="flex space-x-2">
                            <Button
                              onClick={handleAddGoal}
                              disabled={!newGoal.title || !newGoal.target || !newGoal.deadline}
                              className="flex-1 bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                            >
                              Create Goal
                            </Button>
                            <Button
                              onClick={() => setShowAddGoal(false)}
                              variant="outline"
                              className="border-white/20 text-white hover:bg-white/10"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
