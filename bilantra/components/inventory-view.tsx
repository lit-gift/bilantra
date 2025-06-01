"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, AlertTriangle, TrendingUp, Plus, Trash2, Edit3 } from "lucide-react"

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
  cashFlowData: any[]
  inventoryData: Array<{
    id: number
    name: string
    stock: number
    minStock: number
    price: number
    status: "good" | "low" | "critical"
  }>
  currency: string
  lastActivity: number
}

interface InventoryViewProps {
  userData: UserData
  onUpdateData: (updates: Partial<UserData>) => void
}

export function InventoryView({ userData, onUpdateData }: InventoryViewProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingItem, setEditingItem] = useState<number | null>(null)
  const [newItem, setNewItem] = useState({
    name: "",
    stock: "",
    minStock: "",
    price: "",
  })

  const currencySymbol = currencies[userData.currency as keyof typeof currencies] || "$"

  const totalValue = userData.inventoryData.reduce((sum, item) => sum + item.stock * item.price, 0)
  const lowStockItems = userData.inventoryData.filter((item) => item.status !== "good").length

  const calculateStatus = (stock: number, minStock: number): "good" | "low" | "critical" => {
    if (stock === 0) return "critical"
    if (stock <= minStock) return "low"
    return "good"
  }

  const handleAddItem = () => {
    if (!newItem.name || !newItem.stock || !newItem.minStock || !newItem.price) return

    const item = {
      id: Date.now(),
      name: newItem.name,
      stock: Number.parseInt(newItem.stock),
      minStock: Number.parseInt(newItem.minStock),
      price: Number.parseFloat(newItem.price),
      status: calculateStatus(Number.parseInt(newItem.stock), Number.parseInt(newItem.minStock)),
    }

    const updatedInventoryData = [...userData.inventoryData, item]
    onUpdateData({ inventoryData: updatedInventoryData })

    setNewItem({ name: "", stock: "", minStock: "", price: "" })
    setShowAddForm(false)
  }

  const handleDeleteItem = (id: number) => {
    const updatedInventoryData = userData.inventoryData.filter((item) => item.id !== id)
    onUpdateData({ inventoryData: updatedInventoryData })
  }

  const handleUpdateStock = (id: number, newStock: number) => {
    const updatedInventoryData = userData.inventoryData.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          stock: newStock,
          status: calculateStatus(newStock, item.minStock),
        }
      }
      return item
    })
    onUpdateData({ inventoryData: updatedInventoryData })
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Inventory</h2>
        <p className="text-white/70">Manage your stock levels</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-4 bg-blue-500/10 border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-300 text-sm">Total Value</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xl font-bold text-blue-400">
              {currencySymbol}
              {totalValue.toLocaleString()}
            </p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-4 bg-orange-500/10 border-orange-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-300 text-sm">Low Stock</span>
              <AlertTriangle className="w-4 h-4 text-orange-400" />
            </div>
            <p className="text-xl font-bold text-orange-400">{lowStockItems} items</p>
          </Card>
        </motion.div>
      </div>

      {/* Add Item Button */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </motion.div>

      {/* Add Item Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 bg-white/10 backdrop-blur-lg border-white/20">
              <h3 className="text-white font-semibold mb-4">Add New Inventory Item</h3>
              <div className="space-y-4">
                <Input
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Current Stock"
                    value={newItem.stock}
                    onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Input
                    type="number"
                    placeholder="Min Stock"
                    value={newItem.minStock}
                    onChange={(e) => setNewItem({ ...newItem, minStock: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>

                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price per unit"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />

                <div className="flex space-x-2">
                  <Button
                    onClick={handleAddItem}
                    disabled={!newItem.name || !newItem.stock || !newItem.minStock || !newItem.price}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Add Item
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

      {/* Inventory List */}
      {userData.inventoryData.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-4 bg-white/10 backdrop-blur-lg border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Current Stock</h3>

            <div className="space-y-3">
              {userData.inventoryData.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center mr-3">
                      <Package className="w-4 h-4 text-emerald-400" />
                    </div>

                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{item.name}</p>
                      <p className="text-white/60 text-xs">
                        {currencySymbol}
                        {item.price} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="flex items-center">
                        {editingItem === item.id ? (
                          <Input
                            type="number"
                            defaultValue={item.stock}
                            onBlur={(e) => handleUpdateStock(item.id, Number.parseInt(e.target.value) || 0)}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handleUpdateStock(item.id, Number.parseInt((e.target as HTMLInputElement).value) || 0)
                              }
                            }}
                            className="w-16 h-6 text-xs bg-white/10 border-white/20 text-white mr-2"
                            autoFocus
                          />
                        ) : (
                          <span
                            className="text-white font-semibold mr-2 cursor-pointer hover:text-emerald-400"
                            onClick={() => setEditingItem(item.id)}
                          >
                            {item.stock}
                          </span>
                        )}
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.status === "good"
                              ? "bg-emerald-400"
                              : item.status === "low"
                                ? "bg-orange-400"
                                : "bg-red-400"
                          }`}
                        />
                      </div>
                      <p className="text-white/60 text-xs">Min: {item.minStock}</p>
                    </div>

                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => setEditingItem(item.id)}
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-1"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteItem(item.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 text-center">
            <Package className="w-12 h-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No Inventory Items</h3>
            <p className="text-white/60 text-sm mb-4">Start adding your products to track stock levels and value</p>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
