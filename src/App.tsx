import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'
import { 
  Shield, 
  Check, 
  AlertCircle, 
  MessageSquare, 
  Zap, 
  Lock, 
  Globe, 
  BarChart3,
  Server,
  ArrowRight,
  ChevronDown,
  Monitor,
  Bug,
  Eye,
  Radar,
  Terminal,
  Activity,
  Cpu,
  Database,
  Wifi
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ============================================================
// UTILS
// ============================================================

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================
// TYPES
// ============================================================

type FormData = {
  name: string
  company: string
  email: string
  phone: string
  site_url: string
  authorize_test: boolean
}

type Answers = {
  q1?: string
  q2?: string
  q3?: string
  q4?: string
  q5?: string
}

// ============================================================
// CONSTANTS
// ============================================================

const SCORE_WEIGHTS: Record<string, Record<string, number>> = {
  q1: { '1-10': 30, '11-50': 50, '51-200': 70, '200+': 90 },
  q2: { 'sim': 100, 'nao-sei': 70, 'nao': 30 },
  q3: { 'nenhuma': 100, 'basico': 70, 'interno': 50, 'consultoria': 20 },
  q4: { 'ransomware': 80, 'vazamento': 70, 'phishing': 60, 'acesso': 75 },
  q5: { 'sim': 50, 'aprovar': 60 }
}

const QUESTIONS = [
  {
    id: 'q1',
    question: 'Quantos funcionários sua empresa tem?',
    options: [
      { value: '1-10', label: '1-10 funcionários' },
      { value: '11-50', label: '11-50 funcionários' },
      { value: '51-200', label: '51-200 funcionários' },
      { value: '200+', label: 'Mais de 200 funcionários' }
    ]
  },
  {
    id: 'q2',
    question: 'Você sabe se sua empresa já foi atacada por hackers?',
    options: [
      { value: 'sim', label: 'Sim, já fomos atacados' },
      { value: 'nao-sei', label: 'Não sei, pode ter sido e não descobrimos' },
      { value: 'nao', label: 'Não, nunca fomos atacados' }
    ]
  },
  {
    id: 'q3',
    question: 'Sua empresa tem algum tipo de proteção de segurança?',
    options: [
      { value: 'nenhuma', label: 'Nenhuma proteção específica' },
      { value: 'basico', label: 'Antivírus básico' },
      { value: 'interno', label: 'Equipe interna de TI' },
      { value: 'consultoria', label: 'Consultoria de segurança' }
    ]
  },
  {
    id: 'q4',
    question: 'O que mais te preocupa em relação à segurança?',
    options: [
      { value: 'ransomware', label: 'Ransomware (sequestro de dados)' },
      { value: 'vazamento', label: 'Vazamento de dados de clientes' },
      { value: 'phishing', label: 'Phishing (e-mails falsos)' },
      { value: 'acesso', label: 'Acesso não autorizado' }
    ]
  },
  {
    id: 'q5',
    question: 'Você tem autoridade para decidir sobre segurança na empresa?',
    options: [
      { value: 'sim', label: 'Sim, eu decido' },
      { value: 'aprovar', label: 'Preciso aprovar com outros' }
    ]
  }
]

// ============================================================
// COMPONENTS
// ============================================================

// Floating Particles Background
const FloatingParticles = () => {
  const particles = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      isAccent: Math.random() > 0.7
    }))
  , [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className={cn(
            "absolute rounded-full blur-sm",
            p.isAccent ? "bg-accent" : "bg-primary"
          )}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0.2
          }}
          animate={{
            y: [0, -30, 30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

// Radial Glow Component
const RadialGlow = ({ 
  className, 
  color = "primary",
  size = 400 
}: { 
  className?: string
  color?: "primary" | "accent"
  size?: number 
}) => (
  <motion.div
    className={cn(
      "absolute rounded-full pointer-events-none radial-glow",
      color === "primary" ? "radial-glow-primary" : "radial-glow-accent",
      className
    )}
    style={{ width: size, height: size }}
    animate={{
      scale: [1, 1.1, 1],
      opacity: [0.12, 0.18, 0.12]
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
)

// Section Component
const Section = ({ 
  children, 
  className, 
  id,
  withGlow = false 
}: { 
  children: React.ReactNode
  className?: string
  id?: string
  withGlow?: boolean
}) => (
  <section 
    id={id} 
    className={cn("py-24 md:py-32 relative overflow-hidden", className)}
  >
    {withGlow && (
      <>
        <RadialGlow className="-top-40 -left-40" size={600} />
        <RadialGlow color="accent" className="top-1/2 -right-40" size={500} />
      </>
    )}
    <div className="max-w-[1280px] mx-auto px-6 relative z-10">
      {children}
    </div>
  </section>
)

// WhatsApp Icon
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-5 h-5", className)}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.377l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.411z"/>
  </svg>
)

// Animated Status Dot
const StatusDot = ({ color = "success" }: { color?: "success" | "warning" | "danger" }) => {
  const colors = {
    success: "bg-emerald-400 shadow-emerald-400/50",
    warning: "bg-amber-400 shadow-amber-400/50",
    danger: "bg-red-400 shadow-red-400/50"
  }
  
  return (
    <span className={cn(
      "w-2 h-2 rounded-full animate-pulse shadow-lg",
      colors[color]
    )} />
  )
}

// ============================================================
// MAIN APP
// ============================================================

export default function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    site_url: '',
    authorize_test: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [score, setScore] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
  
  // Smooth spring for parallax
  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 })

  const totalSteps = QUESTIONS.length + 2

  const calculateScore = (): number => {
    let total = 0
    for (const key in answers) {
      if (SCORE_WEIGHTS[key] && SCORE_WEIGHTS[key][answers[key as keyof Answers] || '']) {
        total += SCORE_WEIGHTS[key][answers[key as keyof Answers] || '']
      }
    }
    return Math.min(100, Math.max(0, Math.round(total / 5)))
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    setTimeout(() => {
      const questionIndex = QUESTIONS.findIndex(q => q.id === questionId)
      if (questionIndex < QUESTIONS.length - 1) {
        setCurrentStep(questionIndex + 2)
      } else {
        setCurrentStep(QUESTIONS.length + 1)
      }
    }, 400)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const finalScore = calculateScore()
    
    try {
      const response = await fetch('https://felipes.zo.space/api/patolino-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quiz_answers: answers,
          quiz_score: finalScore,
          authorize_test: formData.authorize_test
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('HTTP Error:', response.status, errorText)
        alert(`Erro HTTP ${response.status}: ${errorText}`)
        return
      }

      const result = await response.json()
      
      if (result.success) {
        setScore(finalScore)
        setCurrentStep(totalSteps)
      } else {
        alert('Erro: ' + (result.error || 'Erro ao salvar'))
      }
    } catch (error) {
      console.error('Network/Parse Error:', error)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Erro de conexão. Verifique sua internet ou tente novamente.')
      } else {
        alert('Erro ao enviar: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const risk = useMemo(() => {
    if (score >= 80) return { 
      text: 'ALTO', 
      color: '#ef4444', 
      bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      badge: 'risk-badge-high' as const
    }
    if (score >= 50) return { 
      text: 'MÉDIO', 
      color: '#f59e0b', 
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      badge: 'risk-badge-medium' as const
    }
    return { 
      text: 'BAIXO', 
      color: '#10b981', 
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      badge: 'risk-badge-low' as const
    }
  }, [score])

  // ============================================================
  // RENDER RESULT
  // ============================================================
  
  if (currentStep === totalSteps) {
    return (
      <div className="min-h-screen bg-background grid-bg-animated flex items-center justify-center p-6">
        <div className="noise-overlay" />
        <div className="scanline" />
        <FloatingParticles />
        
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg w-full relative"
        >
          {/* Header Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="px-4 py-2 rounded-full glass flex items-center gap-2">
              <StatusDot color="success" />
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em]">
                Agentes de IA Ativos
              </span>
            </div>
          </motion.div>

          {/* Main Card */}
          <div className="border-animated p-8">
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary/30"
              >
                <Shield className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Auditoria Técnica Iniciada
                </h2>
                <p className="text-sm text-zinc-400">
                  Mapeamento de perímetro em andamento
                </p>
              </div>
            </div>

            <p className="text-zinc-400 leading-relaxed mb-6">
              Acesso autorizado com sucesso. Nossos agentes de IA já iniciaram a varredura 
              de vulnerabilidades estruturais no seu domínio.
            </p>

            {/* Risk Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                  Diagnóstico Preliminar
                </span>
                <span className={cn("risk-badge", risk.badge)}>
                  {risk.text} RISCO
                </span>
              </div>
              
              <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                  className="h-full rounded-full"
                  style={{ background: risk.bg }}
                />
              </div>
            </motion.div>

            {/* Processing Status */}
            <div className="space-y-3 mb-8">
              {[
                { icon: <Radar className="w-4 h-4" />, text: "Mapeando portas e serviços expostos", done: true },
                { icon: <Bug className="w-4 h-4" />, text: "Identificando vetores de injeção", done: true },
                { icon: <Database className="w-4 h-4" />, text: "Analisando estrutura de dados", done: false }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/50"
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    item.done ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent animate-pulse"
                  )}>
                    {item.icon}
                  </div>
                  <span className="text-sm text-zinc-300">{item.text}</span>
                  {item.done && (
                    <Check className="w-4 h-4 text-primary ml-auto" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                <p className="text-sm text-white leading-relaxed">
                  O processamento está em andamento. Agende sua call para receber o 
                  <strong className="text-primary"> relatório consolidado</strong> e o 
                  <strong className="text-primary"> plano de mitigação</strong>.
                </p>
              </div>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/5511910376040?text=${encodeURIComponent(
                  `Autorizei a auditoria técnica na Jazz Sec - Attack e o diagnóstico preliminar acusou risco ${risk.text}.\n\n` +
                  `Empresa: ${formData.company}\n` +
                  `Site: ${formData.site_url || 'Não informado'}\n\n` +
                  `Quero agendar a call para receber o relatório completo e a auditoria de segurança.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full py-4 rounded-xl text-base shimmer"
              >
                <WhatsAppIcon />
                Agendar Entrega do Relatório
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ============================================================
  // RENDER QUIZ
  // ============================================================
  
  if (showQuiz) {
    const currentQuestion = QUESTIONS[currentStep - 1]
    const isFormStep = currentStep > QUESTIONS.length
    const progress = Math.round((currentStep / (totalSteps - 1)) * 100)

    return (
      <div className="min-h-screen bg-background grid-bg-animated">
        <div className="noise-overlay" />
        <div className="scanline" />

        {/* Progress Header */}
        <div className="fixed top-0 left-0 right-0 z-50 glass-heavy">
          <div className="max-w-2xl mx-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Análise em Progresso
                </span>
              </div>
              <span className="text-xs font-mono text-primary">{progress}%</span>
            </div>
            <div className="progress-bar">
              <motion.div 
                className="progress-bar-fill bg-gradient-to-r from-primary-600 to-primary-400"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto p-6 pt-28">
          <AnimatePresence mode="wait">
            {isFormStep ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                onSubmit={handleSubmit} 
                className="space-y-5"
              >
                <div className="text-center mb-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30"
                  >
                    <Terminal className="w-8 h-8 text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-2">Finalizar Autorização</h2>
                  <p className="text-zinc-400">Dados necessários para emissão do relatório técnico.</p>
                </div>

                {[
                  { id: 'name', type: 'text', placeholder: 'Seu nome completo', icon: <Globe className="w-4 h-4" /> },
                  { id: 'company', type: 'text', placeholder: 'Nome da Empresa', icon: <Server className="w-4 h-4" /> },
                  { id: 'email', type: 'email', placeholder: 'E-mail Corporativo', icon: <Wifi className="w-4 h-4" /> },
                  { id: 'phone', type: 'tel', placeholder: 'WhatsApp (com DDD)', icon: <MessageSquare className="w-4 h-4" /> },
                  { id: 'site_url', type: 'url', placeholder: 'URL do Site (https://...)', icon: <Shield className="w-4 h-4" /> }
                ].map((field, i) => (
                  <motion.div 
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="relative group"
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors z-10">
                      {field.icon}
                    </div>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      required={field.id !== 'site_url'}
                      value={formData[field.id as keyof FormData] as string}
                      onChange={e => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                      className="input-field"
                    />
                  </motion.div>
                ))}

                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start gap-4 p-5 rounded-2xl glass-card cursor-pointer group hover:bg-surface-3/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    required
                    checked={formData.authorize_test}
                    onChange={e => setFormData(prev => ({ ...prev, authorize_test: e.target.checked }))}
                    className="mt-0.5 w-5 h-5 accent-primary rounded"
                  />
                  <span className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-200 transition-colors">
                    <strong className="text-white">Autorizo formalmente</strong> a realização de testes de intrusão 
                    e varredura de segurança controlada no domínio informado.
                  </span>
                </motion.label>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full py-4 rounded-xl text-base shimmer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Activity className="w-5 h-5" />
                      </motion.div>
                      Iniciando Scan...
                    </span>
                  ) : (
                    <>
                      Autorizar e Gerar Auditoria <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(QUESTIONS.length)}
                  className="w-full py-3 text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
                >
                  Voltar
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key={currentStep}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-3 text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-6">
                    <Cpu className="w-3 h-3" />
                    Questão {currentStep}/{QUESTIONS.length}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {currentQuestion.question}
                  </h2>
                </div>

                <div className="space-y-3">
                  {currentQuestion.options.map((option, i) => (
                    <motion.button
                      key={option.value}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleAnswer(currentQuestion.id, option.value)}
                      className={cn(
                        "w-full p-5 rounded-2xl border text-left transition-all duration-300 group",
                        answers[currentQuestion.id as keyof Answers] === option.value
                          ? 'glass-card border-primary/50 shadow-lg shadow-primary/10'
                          : 'glass-card border-transparent hover:border-white/10'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base text-zinc-200 group-hover:text-white transition-colors">
                          {option.label}
                        </span>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                          answers[currentQuestion.id as keyof Answers] === option.value
                            ? "border-primary bg-primary shadow-lg shadow-primary/30"
                            : "border-zinc-700 group-hover:border-zinc-500"
                        )}>
                          {answers[currentQuestion.id as keyof Answers] === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                            >
                              <Check className="w-3 h-3 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="mt-8 text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
                  >
                    Voltar
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // ============================================================
  // RENDER LANDING PAGE
  // ============================================================
  
  return (
    <div ref={containerRef} className="min-h-screen bg-background text-zinc-300 font-sans overflow-x-hidden">
      <div className="noise-overlay" />
      <div className="scanline" />
      <FloatingParticles />
      
      {/* NAV */}
      <nav className="fixed top-0 w-full z-[100] glass-heavy">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-black text-lg tracking-tighter text-white">
              Jazz Sec - Attack
            </span>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setCurrentStep(1); setShowQuiz(true); }}
            className="btn btn-primary px-6 py-2.5 rounded-xl text-xs"
          >
            Iniciar Auditoria
          </motion.button>
        </div>
      </nav>

      {/* HERO */}
      <Section className="min-h-screen flex items-center pt-20" withGlow>
        <FloatingParticles />
        
        <motion.div 
          style={{ y: smoothHeroY, opacity: heroOpacity, scale: heroScale }}
          className="text-center max-w-[900px] mx-auto"
        >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass mb-8"
          >
            <StatusDot color="warning" />
            <span className="text-accent text-xs font-bold uppercase tracking-wider">
              Vagas limitadas para {new Date().toLocaleDateString('pt-BR', { month: 'long' })}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8"
          >
            <span className="text-white">AUDITORIA DE</span>
            <br />
            <span className="text-gradient-fire text-glow-primary inline-block">
              SEGURANÇA
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-[640px] mx-auto mb-12"
          >
            Descubra as brechas críticas no seu negócio antes que agentes mal-intencionados 
            as explorem. <span className="text-white font-medium">Mapeamento técnico e intrusão controlada.</span>
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(220, 38, 38, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setCurrentStep(1); setShowQuiz(true); }}
              className="btn btn-primary px-10 py-5 rounded-2xl text-sm shimmer"
            >
              SOLICITAR SCAN GRATUITO <ArrowRight className="w-4 h-4" />
            </motion.button>
            
            <a href="#how" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-200 transition-colors p-4">
              Metodologia <ChevronDown className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>
      </Section>

      {/* STATS */}
      <div className="border-y border-white/5 glass-heavy relative z-10">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Custo Médio de Vazamento", value: "R$ 21.5M", icon: <BarChart3 /> },
              { label: "Dias até Detecção", value: "197", icon: <Eye /> },
              { label: "Empresas que Fecham", value: "60%", icon: <AlertCircle /> },
              { label: "Ataques via Phishing", value: "91%", icon: <Bug /> }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-12 h-12 rounded-2xl glass-card mx-auto mb-4 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-5xl font-black mb-2 tracking-tighter text-gradient-primary">
                  {stat.value}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-zinc-500 leading-tight">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* RISK CARDS */}
      <Section id="risk" withGlow>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4 block">
            Riscos Reais
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            O QUE ESTÁ EM JOGO
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              title: "Multas LGPD", 
              desc: "Até 2% do faturamento ou R$ 50 milhões por cada infração detectada.",
              icon: <AlertCircle className="text-primary" />,
              gradient: "from-primary-600/20 to-transparent"
            },
            { 
              title: "Responsabilidade Civil", 
              desc: "Diretores respondem com patrimônio pessoal por falhas de segurança negligenciadas.",
              icon: <Lock className="text-accent" />,
              gradient: "from-accent/20 to-transparent"
            },
            { 
              title: "Dano Reputacional", 
              desc: "60% das empresas encerram atividades em até 6 meses após um ataque crítico.",
              icon: <BarChart3 className="text-primary" />,
              gradient: "from-primary-600/20 to-transparent"
            }
          ].map((card, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -8 }}
              className="glass-card glass-card-hover p-8 rounded-3xl relative overflow-hidden group"
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity",
                card.gradient
              )} />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl glass-card mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{card.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* METHODOLOGY */}
      <Section id="how" className="bg-surface-2/30">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[640px] mb-20"
        >
          <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4 block">
            Fluxo Operacional
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            METODOLOGIA DE AUDITORIA
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            { 
              step: "01", 
              title: "Questionário de Vetores", 
              desc: "Análise inicial dos ativos expostos e vetores de ataque potenciais.",
              icon: <Terminal />
            },
            { 
              step: "02", 
              title: "Varredura de Agentes", 
              desc: "Nossos agentes de IA executam testes de intrusão e mapeamento de portas.",
              icon: <Cpu />
            },
            { 
              step: "03", 
              title: "Entrega Técnica", 
              desc: "Call de 15 min para entrega do relatório consolidado e plano de mitigação.",
              icon: <Activity />
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative group"
            >
              <div className="absolute -top-8 -left-4 text-7xl font-black text-white/[0.03] pointer-events-none group-hover:text-white/[0.06] transition-colors">
                {item.step}
              </div>
              
              <div className="relative z-10 pl-4 border-l-2 border-white/5 group-hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-surface-3 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-4">{item.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <Section className="text-center" withGlow>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="border-animated p-12 md:p-16">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
              VULNERABILIDADES<br />NÃO ESPERAM.
            </h2>
            
            <p className="text-zinc-400 mb-10 max-w-md mx-auto">
              Cada dia sem proteção é uma oportunidade para atacantes. 
              Identifique as brechas antes que seja tarde demais.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(220, 38, 38, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setCurrentStep(1); setShowQuiz(true); }}
              className="btn btn-primary px-12 py-5 rounded-2xl text-sm shimmer"
            >
              BLOQUEAR ATAQUES AGORA <Shield className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-12 bg-surface-2/50">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-black text-sm tracking-tighter text-white">Jazz Sec - Attack</span>
          </div>
          
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest text-center">
            © 2025 Segurança Cibernética Avançada
          </p>
          
          <div className="flex items-center gap-6">
            {[Monitor, Lock, Zap].map((Icon, i) => (
              <Icon key={i} className="w-4 h-4 text-zinc-700 hover:text-zinc-400 transition-colors cursor-pointer" />
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
