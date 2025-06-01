"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"
import { LoanAnalyzer } from "@/components/loan-analyzer"
import { Navigation } from "@/components/navigation"
import { AIAssistant } from "@/components/ai-assistant"
import { HowItWorks } from "@/components/how-it-works"
import { CurrencySelector } from "@/components/currency-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"

// Language Context
const LanguageContext = createContext<{
  language: string
  setLanguage: (lang: string) => void
  t: (key: string) => string
}>({
  language: "en",
  setLanguage: () => {},
  t: (key: string) => key,
})

export const useLanguage = () => useContext(LanguageContext)

// Translations
const translations = {
  en: {
    welcome: "Welcome to Bilantra",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    dashboard: "Dashboard",
    overview: "Overview",
    cashFlow: "Cash Flow",
    inventory: "Inventory",
    aiAssistant: "AI Assistant",
    loanCenter: "Loan Center",
    revenue: "Revenue",
    weeklyRevenue: "Weekly Revenue",
    monthlyRevenue: "Monthly Revenue",
    yearlyRevenue: "Yearly Revenue",
    loanReadiness: "Loan Readiness",
    quickInvoice: "Quick Invoice",
    signIn: "Sign In",
    signUp: "Sign Up",
    logout: "Logout",
    businessName: "Business Name",
    ownerName: "Your Full Name",
    email: "Email Address",
    city: "City/Region",
    password: "Password",
    currency: "Currency",
    language: "Language",
    clientName: "Client Name",
    reports: "Reports",
    team: "Team",
    integrations: "Integrations",
    settings: "Settings",
    analytics: "Analytics",
    performance: "Performance",
    growth: "Growth",
    expenses: "Expenses",
    profit: "Profit",
    savings: "Savings",
  },
  es: {
    welcome: "Bienvenido a Bilantra",
    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",
    dashboard: "Panel de Control",
    overview: "Resumen",
    cashFlow: "Flujo de Efectivo",
    inventory: "Inventario",
    aiAssistant: "Asistente IA",
    loanCenter: "Centro de Préstamos",
    revenue: "Ingresos",
    weeklyRevenue: "Ingresos Semanales",
    monthlyRevenue: "Ingresos Mensuales",
    yearlyRevenue: "Ingresos Anuales",
    loanReadiness: "Preparación para Préstamo",
    quickInvoice: "Factura Rápida",
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    logout: "Cerrar Sesión",
    businessName: "Nombre del Negocio",
    ownerName: "Su Nombre Completo",
    email: "Correo Electrónico",
    city: "Ciudad/Región",
    password: "Contraseña",
    currency: "Moneda",
    language: "Idioma",
    clientName: "Nombre del Cliente",
    reports: "Informes",
    team: "Equipo",
    integrations: "Integraciones",
    settings: "Configuración",
    analytics: "Analíticas",
    performance: "Rendimiento",
    growth: "Crecimiento",
    expenses: "Gastos",
    profit: "Beneficio",
    savings: "Ahorros",
  },
  fr: {
    welcome: "Bienvenue sur Bilantra",
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    dashboard: "Tableau de Bord",
    overview: "Aperçu",
    cashFlow: "Flux de Trésorerie",
    inventory: "Inventaire",
    aiAssistant: "Assistant IA",
    loanCenter: "Centre de Prêt",
    revenue: "Revenus",
    weeklyRevenue: "Revenus Hebdomadaires",
    monthlyRevenue: "Revenus Mensuels",
    yearlyRevenue: "Revenus Annuels",
    loanReadiness: "Préparation au Prêt",
    quickInvoice: "Facture Rapide",
    signIn: "Se Connecter",
    signUp: "S'inscrire",
    logout: "Déconnexion",
    businessName: "Nom de l'Entreprise",
    ownerName: "Votre Nom Complet",
    email: "Adresse Email",
    city: "Ville/Région",
    password: "Mot de Passe",
    currency: "Devise",
    language: "Langue",
    clientName: "Nom du Client",
    reports: "Rapports",
    team: "Équipe",
    integrations: "Intégrations",
    settings: "Paramètres",
    analytics: "Analyses",
    performance: "Performance",
    growth: "Croissance",
    expenses: "Dépenses",
    profit: "Profit",
    savings: "Économies",
  },
  ar: {
    welcome: "مرحباً بك في بيلانترا",
    goodMorning: "صباح الخير",
    goodAfternoon: "مساء الخير",
    goodEvening: "مساء الخير",
    dashboard: "لوحة التحكم",
    overview: "نظرة عامة",
    cashFlow: "التدفق النقدي",
    inventory: "المخزون",
    aiAssistant: "المساعد الذكي",
    loanCenter: "مركز القروض",
    revenue: "الإيرادات",
    weeklyRevenue: "الإيرادات الأسبوعية",
    monthlyRevenue: "الإيرادات الشهرية",
    yearlyRevenue: "الإيرادات السنوية",
    loanReadiness: "جاهزية القرض",
    quickInvoice: "فاتورة سريعة",
    signIn: "تسجيل الدخول",
    signUp: "إنشاء حساب",
    logout: "تسجيل الخروج",
    businessName: "اسم الشركة",
    ownerName: "اسمك الكامل",
    email: "البريد الإلكتروني",
    city: "المدينة/المنطقة",
    password: "كلمة المرور",
    currency: "العملة",
    language: "اللغة",
    clientName: "اسم العميل",
    reports: "التقارير",
    team: "الفريق",
    integrations: "التكاملات",
    settings: "الإعدادات",
    analytics: "التحليلات",
    performance: "الأداء",
    growth: "النمو",
    expenses: "المصروفات",
    profit: "الربح",
    savings: "المدخرات",
  },
  sw: {
    welcome: "Karibu Bilantra",
    goodMorning: "Habari za asubuhi",
    goodAfternoon: "Habari za mchana",
    goodEvening: "Habari za jioni",
    dashboard: "Dashibodi",
    overview: "Muhtasari",
    cashFlow: "Mtiririko wa Fedha",
    inventory: "Hifadhi",
    aiAssistant: "Msaidizi wa AI",
    loanCenter: "Kituo cha Mikopo",
    revenue: "Mapato",
    weeklyRevenue: "Mapato ya Kila Wiki",
    monthlyRevenue: "Mapato ya Kila Mwezi",
    yearlyRevenue: "Mapato ya Kila Mwaka",
    loanReadiness: "Utayari wa Mkopo",
    quickInvoice: "Ankara ya Haraka",
    signIn: "Ingia",
    signUp: "Jisajili",
    logout: "Toka",
    businessName: "Jina la Biashara",
    ownerName: "Jina Lako Kamili",
    email: "Barua Pepe",
    city: "Mji/Mkoa",
    password: "Nenosiri",
    currency: "Sarafu",
    language: "Lugha",
    clientName: "Jina la Mteja",
    reports: "Ripoti",
    team: "Timu",
    integrations: "Muunganisho",
    settings: "Mipangilio",
    analytics: "Uchambuzi",
    performance: "Utendaji",
    growth: "Ukuaji",
    expenses: "Matumizi",
    profit: "Faida",
    savings: "Akiba",
  },
  pt: {
    welcome: "Bem-vindo ao Bilantra",
    goodMorning: "Bom dia",
    goodAfternoon: "Boa tarde",
    goodEvening: "Boa noite",
    dashboard: "Painel",
    overview: "Visão Geral",
    cashFlow: "Fluxo de Caixa",
    inventory: "Inventário",
    aiAssistant: "Assistente IA",
    loanCenter: "Centro de Empréstimos",
    revenue: "Receita",
    weeklyRevenue: "Receita Semanal",
    monthlyRevenue: "Receita Mensal",
    yearlyRevenue: "Receita Anual",
    loanReadiness: "Preparação para Empréstimo",
    quickInvoice: "Fatura Rápida",
    signIn: "Entrar",
    signUp: "Cadastrar",
    logout: "Sair",
    businessName: "Nome da Empresa",
    ownerName: "Seu Nome Completo",
    email: "Endereço de Email",
    city: "Cidade/Região",
    password: "Senha",
    currency: "Moeda",
    language: "Idioma",
    clientName: "Nome do Cliente",
    reports: "Relatórios",
    team: "Equipe",
    integrations: "Integrações",
    settings: "Configurações",
    analytics: "Análises",
    performance: "Desempenho",
    growth: "Crescimento",
    expenses: "Despesas",
    profit: "Lucro",
    savings: "Economias",
  },
}

interface UserData {
  profile: {
    businessName: string
    ownerName: string
    email: string
    city: string
    password: string
  }
  salesData: Array<{ day: string; revenue: number }>
  cashFlowData: Array<{
    id: number
    type: "income" | "expense"
    amount: number
    description: string
    date: string
    time: string
  }>
  inventoryData: Array<{
    id: number
    name: string
    stock: number
    minStock: number
    price: number
    status: "good" | "low" | "critical"
  }>
  currency: string
  language: string
  lastActivity: number
}

export default function Bilantra() {
  const [currentView, setCurrentView] = useState<"onboarding" | "login" | "dashboard" | "loan-analyzer">("login")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [themeMode, setThemeMode] = useState<"light" | "dark">("dark")
  const [language, setLanguage] = useState("en")

  const t = (key: string) => {
    return translations[language as keyof typeof translations]?.[key as keyof typeof translations.en] || key
  }

  // Check for existing user data and session
  useEffect(() => {
    const savedData = localStorage.getItem("bilantra_userData")
    const savedLanguage = localStorage.getItem("bilantra_language")

    if (savedLanguage) {
      setLanguage(savedLanguage)
    }

    if (savedData) {
      const data: UserData = JSON.parse(savedData)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (now - data.lastActivity < twentyFourHours) {
        setUserData(data)
        setIsAuthenticated(true)
        setCurrentView("dashboard")
        if (data.language) {
          setLanguage(data.language)
        }
      } else {
        localStorage.removeItem("bilantra_userData")
      }
    }
  }, [])

  // Update last activity every minute
  useEffect(() => {
    if (isAuthenticated && userData) {
      const interval = setInterval(() => {
        const updatedData = { ...userData, lastActivity: Date.now() }
        setUserData(updatedData)
        localStorage.setItem("bilantra_userData", JSON.stringify(updatedData))
      }, 60000)

      return () => clearInterval(interval)
    }
  }, [isAuthenticated, userData])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    localStorage.setItem("bilantra_language", newLanguage)
    if (userData) {
      updateUserData({ language: newLanguage })
    }
  }

  const handleSignUp = () => {
    setIsNewUser(true)
    setCurrentView("onboarding")
  }

  const handleAuthComplete = (profile: any) => {
    const newUserData: UserData = {
      profile,
      salesData: [
        { day: "Mon", revenue: 0 },
        { day: "Tue", revenue: 0 },
        { day: "Wed", revenue: 0 },
        { day: "Thu", revenue: 0 },
        { day: "Fri", revenue: 0 },
        { day: "Sat", revenue: 0 },
        { day: "Sun", revenue: 0 },
      ],
      cashFlowData: [],
      inventoryData: [],
      currency: "USD",
      language: language,
      lastActivity: Date.now(),
    }

    setUserData(newUserData)
    localStorage.setItem("bilantra_userData", JSON.stringify(newUserData))
    setIsAuthenticated(true)
    setCurrentView("dashboard")
  }

  const handleLogin = (email: string, password: string) => {
    const savedData = localStorage.getItem("bilantra_userData")
    if (savedData) {
      const data: UserData = JSON.parse(savedData)
      if (data.profile.email === email && data.profile.password === password) {
        const updatedData = { ...data, lastActivity: Date.now() }
        setUserData(updatedData)
        localStorage.setItem("bilantra_userData", JSON.stringify(updatedData))
        setIsAuthenticated(true)
        setCurrentView("dashboard")
        return true
      }
    }
    return false
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUserData(null)
    setCurrentView("login")
    setActiveTab("overview")
  }

  const updateUserData = (updates: Partial<UserData>) => {
    if (userData) {
      const updatedData = { ...userData, ...updates, lastActivity: Date.now() }
      setUserData(updatedData)
      localStorage.setItem("bilantra_userData", JSON.stringify(updatedData))
    }
  }

  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === "light" ? "dark" : "light"))
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  }

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      <div className={`min-h-screen ${themeMode === "dark" ? "bg-slate-900" : "bg-gray-50"}`}>
        {/* Language Selector - Always visible */}
        <LanguageSelector currentLanguage={language} onLanguageChange={handleLanguageChange} />

        {/* How It Works Button - Only show when not authenticated */}
        {!isAuthenticated && <HowItWorks />}

        {/* Currency Selector - Only show when authenticated */}
        {isAuthenticated && userData && (
          <CurrencySelector
            currentCurrency={userData.currency}
            onCurrencyChange={(currency) => updateUserData({ currency })}
          />
        )}

        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <motion.div
              key={currentView}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {currentView === "login" && <LoginForm onLogin={handleLogin} onSignUp={handleSignUp} />}
              {currentView === "onboarding" && <OnboardingFlow onComplete={handleAuthComplete} />}
            </motion.div>
          ) : (
            <motion.div
              key="main-app"
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
              className="relative z-10"
            >
              <Navigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onViewChange={setCurrentView}
                onLogout={handleLogout}
                themeMode={themeMode}
                onThemeToggle={toggleTheme}
                userProfile={userData!.profile}
              />

              {isAuthenticated && <ThemeToggle theme={themeMode} onToggle={toggleTheme} />}

              <AnimatePresence mode="wait">
                {currentView === "dashboard" && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Dashboard activeTab={activeTab} userData={userData!} onUpdateData={updateUserData} />
                  </motion.div>
                )}

                {currentView === "loan-analyzer" && (
                  <motion.div
                    key="loan-analyzer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LoanAnalyzer userData={userData!} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AIAssistant />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LanguageContext.Provider>
  )
}
