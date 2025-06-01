"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Plus, Edit3, Trash2, Shield, Eye, Settings, X, Crown, UserCheck, UserX } from "lucide-react"
import { useLanguage } from "@/app/page"

interface User {
  id: number
  name: string
  email: string
  role: "owner" | "admin" | "manager" | "employee" | "viewer"
  permissions: string[]
  status: "active" | "inactive"
  lastLogin: Date
  avatar?: string
}

interface UserRolesProps {
  isOpen: boolean
  onClose: () => void
  currentUser: any
}

const rolePermissions = {
  owner: [
    "manage_users",
    "manage_finances",
    "manage_inventory",
    "view_reports",
    "manage_settings",
    "delete_data",
    "export_data",
    "manage_integrations",
  ],
  admin: ["manage_users", "manage_finances", "manage_inventory", "view_reports", "manage_settings", "export_data"],
  manager: ["manage_inventory", "view_reports", "manage_finances", "export_data"],
  employee: ["manage_inventory", "view_reports"],
  viewer: ["view_reports"],
}

const roleColors = {
  owner: "from-purple-500 to-pink-500",
  admin: "from-red-500 to-orange-500",
  manager: "from-blue-500 to-cyan-500",
  employee: "from-green-500 to-emerald-500",
  viewer: "from-gray-500 to-slate-500",
}

export function UserRoles({ isOpen, onClose, currentUser }: UserRolesProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: currentUser.ownerName,
      email: currentUser.email,
      role: "owner",
      permissions: rolePermissions.owner,
      status: "active",
      lastLogin: new Date(),
    },
    {
      id: 2,
      name: "Sarah Manager",
      email: "sarah@business.com",
      role: "manager",
      permissions: rolePermissions.manager,
      status: "active",
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 3,
      name: "John Employee",
      email: "john@business.com",
      role: "employee",
      permissions: rolePermissions.employee,
      status: "active",
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ])

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "employee" as User["role"],
  })
  const { t } = useLanguage()

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return

    const user: User = {
      id: Date.now(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      permissions: rolePermissions[newUser.role],
      status: "active",
      lastLogin: new Date(),
    }

    setUsers((prev) => [...prev, user])
    setNewUser({ name: "", email: "", role: "employee" })
    setShowAddUser(false)
  }

  const handleUpdateUserRole = (userId: number, newRole: User["role"]) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole, permissions: rolePermissions[newRole] } : user,
      ),
    )
  }

  const handleToggleUserStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  const handleDeleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId))
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4" />
      case "admin":
        return <Shield className="w-4 h-4" />
      case "manager":
        return <Settings className="w-4 h-4" />
      case "employee":
        return <UserCheck className="w-4 h-4" />
      case "viewer":
        return <Eye className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
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
            className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/20">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">User Management</h2>
                  <p className="text-white/70">Manage team members and their permissions</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setShowAddUser(true)}
                    className="bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
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

              <div className="flex flex-1 overflow-hidden">
                {/* Users List */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="grid gap-4">
                    {users.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1A1A40] to-[#FFD700] flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </span>
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{user.name}</h3>
                              <p className="text-white/60 text-sm">{user.email}</p>
                              <p className="text-white/50 text-xs">Last login: {user.lastLogin.toLocaleDateString()}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {/* Role Badge */}
                            <div
                              className={`px-3 py-1 rounded-full bg-gradient-to-r ${roleColors[user.role]} text-white text-xs font-medium flex items-center space-x-1`}
                            >
                              {getRoleIcon(user.role)}
                              <span className="capitalize">{user.role}</span>
                            </div>

                            {/* Status */}
                            <div
                              className={`w-2 h-2 rounded-full ${
                                user.status === "active" ? "bg-emerald-400" : "bg-red-400"
                              }`}
                            />

                            {/* Actions */}
                            <div className="flex items-center space-x-1">
                              <Button
                                onClick={() => setSelectedUser(user)}
                                size="sm"
                                variant="ghost"
                                className="text-white/60 hover:text-white hover:bg-white/10"
                              >
                                <Edit3 className="w-3 h-3" />
                              </Button>

                              {user.role !== "owner" && (
                                <>
                                  <Button
                                    onClick={() => handleToggleUserStatus(user.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-white/60 hover:text-white hover:bg-white/10"
                                  >
                                    {user.status === "active" ? (
                                      <UserX className="w-3 h-3" />
                                    ) : (
                                      <UserCheck className="w-3 h-3" />
                                    )}
                                  </Button>

                                  <Button
                                    onClick={() => handleDeleteUser(user.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* User Details Panel */}
                {selectedUser && (
                  <div className="w-80 border-l border-white/20 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-white">User Details</h3>
                      <Button
                        onClick={() => setSelectedUser(null)}
                        size="sm"
                        variant="ghost"
                        className="text-white/60 hover:text-white hover:bg-white/10"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-6">
                      {/* User Info */}
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#1A1A40] to-[#FFD700] flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-lg">
                            {selectedUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <h4 className="text-white font-semibold">{selectedUser.name}</h4>
                        <p className="text-white/60 text-sm">{selectedUser.email}</p>
                      </div>

                      {/* Role Selection */}
                      {selectedUser.role !== "owner" && (
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">Role</label>
                          <select
                            value={selectedUser.role}
                            onChange={(e) => handleUpdateUserRole(selectedUser.id, e.target.value as User["role"])}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                          >
                            <option value="admin" className="bg-slate-800">
                              Admin
                            </option>
                            <option value="manager" className="bg-slate-800">
                              Manager
                            </option>
                            <option value="employee" className="bg-slate-800">
                              Employee
                            </option>
                            <option value="viewer" className="bg-slate-800">
                              Viewer
                            </option>
                          </select>
                        </div>
                      )}

                      {/* Permissions */}
                      <div>
                        <h5 className="text-white font-medium mb-3">Permissions</h5>
                        <div className="space-y-2">
                          {selectedUser.permissions.map((permission) => (
                            <div key={permission} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                              <span className="text-white/70 text-sm">
                                {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        <h5 className="text-white font-medium mb-2">Status</h5>
                        <div
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${
                            selectedUser.status === "active"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              selectedUser.status === "active" ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          <span className="text-sm capitalize">{selectedUser.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Add User Modal */}
              <AnimatePresence>
                {showAddUser && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowAddUser(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="w-full max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Add New User</h3>

                        <div className="space-y-4">
                          <Input
                            placeholder="Full Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />

                          <Input
                            type="email"
                            placeholder="Email Address"
                            value={newUser.email}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                          />

                          <select
                            value={newUser.role}
                            onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as User["role"] }))}
                            className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
                          >
                            <option value="employee" className="bg-slate-800">
                              Employee
                            </option>
                            <option value="manager" className="bg-slate-800">
                              Manager
                            </option>
                            <option value="admin" className="bg-slate-800">
                              Admin
                            </option>
                            <option value="viewer" className="bg-slate-800">
                              Viewer
                            </option>
                          </select>

                          <div className="flex space-x-2">
                            <Button
                              onClick={handleAddUser}
                              disabled={!newUser.name || !newUser.email}
                              className="flex-1 bg-gradient-to-r from-[#1A1A40] to-[#FFD700] hover:from-[#1A1A40]/80 hover:to-[#FFD700]/80 text-white"
                            >
                              Add User
                            </Button>
                            <Button
                              onClick={() => setShowAddUser(false)}
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
