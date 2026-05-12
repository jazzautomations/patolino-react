import { useState } from 'react'

// ═══ TYPES ═══
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

// ═══ CONSTANTS ═══
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

// ═══ COMPONENTS ═══
function ShieldIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

function AlertCircleIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
    </svg>
  )
}

function CartIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6l3 1 .75 9.34a2 2 0 002 1.66h8.5a2 2 0 002-1.66L20 7H6.25M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z"/>
    </svg>
  )
}

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  )
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.377l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.511-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.411z"/>
    </svg>
  )
}

// ═══ MAIN APP ═══
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
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const totalSteps = QUESTIONS.length + 2 // questions + form + result

  const calculateScore = (): number => {
    let total = 0
    for (const key in answers) {
      if (SCORE_WEIGHTS[key] && SCORE_WEIGHTS[key][answers[key as keyof Answers] || '']) {
        total += SCORE_WEIGHTS[key][answers[key as keyof Answers] || '']
      }
    }
    return Math.min(100, Math.max(0, Math.round(total / 5)))
  }

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { text: 'Alto', color: '#ef4444', bg: 'linear-gradient(to right, #ef4444, #dc2626)' }
    if (score >= 50) return { text: 'Médio', color: '#f59e0b', bg: 'linear-gradient(to right, #f59e0b, #d97706)' }
    return { text: 'Baixo', color: '#4ade80', bg: 'linear-gradient(to right, #4ade80, #22c55e)' }
  }

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    // Auto advance after selection
    setTimeout(() => {
      const questionIndex = QUESTIONS.findIndex(q => q.id === questionId)
      if (questionIndex < QUESTIONS.length - 1) {
        setCurrentStep(questionIndex + 2) // +2 because step is 1-indexed
      } else {
        setCurrentStep(QUESTIONS.length + 1) // Go to form
      }
    }, 300)
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

      // Check if response is ok before parsing
      if (!response.ok) {
        const errorText = await response.text()
        console.error('HTTP Error:', response.status, errorText)
        alert(`Erro HTTP ${response.status}: ${errorText}`)
        return
      }

      const result = await response.json()
      
      if (result.success) {
        setScore(finalScore)
        setCurrentStep(totalSteps) // Show result
      } else {
        alert('Erro: ' + (result.error || 'Erro ao salvar'))
      }
    } catch (error) {
      console.error('Network/Parse Error:', error)
      // Check if it's a CORS or network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        alert('Erro de conexão. Verifique sua internet ou tente novamente.')
      } else {
        alert('Erro ao enviar: ' + (error instanceof Error ? error.message : 'Erro desconhecido'))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = Math.round((currentStep / (totalSteps - 1)) * 100)
  const risk = getRiskLevel(score)

  // ═══ RENDER ═══
  if (currentStep === totalSteps) {
    // RESULT STEP
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-[rgba(220,38,38,0.12)] flex items-center justify-center mx-auto mb-6">
            <CheckIcon className="w-8 h-8 text-[#ef4444]" />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Diagnóstico Gerado!</h3>
          <p className="text-sm text-[#a1a1aa] mb-6">Com base nas suas respostas, identificamos pontos críticos de atenção.</p>

          <div className="mb-8 p-6 rounded-xl bg-[#0f0f0f] border border-[#2a2a32]">
            <div className="text-xs text-[#71717a] mb-2 font-mono">Nível de Risco Estimado</div>
            <div className="text-4xl font-bold font-mono mb-2" style={{ color: risk.color }}>
              {risk.text}
            </div>
            <div className="h-3 bg-[#1f1f27] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ width: score + '%', background: risk.bg }}
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#111113] border border-[#2a2a32] mb-6">
            <p className="text-sm text-[#a1a1aa] mb-4">
              Agende uma call de 15 minutos para ver a análise completa do seu caso e receber recomendações personalizadas.
            </p>
            <a 
              href={`https://wa.me/5511910376040?text=${encodeURIComponent(
                `Olá! Acabei de fazer o diagnóstico de segurança da Patolino.Security.\n\n` +
                `📊 Meu nível de risco: ${risk.text}\n` +
                `🏢 Empresa: ${formData.company}\n` +
                `🌐 Site: ${formData.site_url || 'Não informado'}\n\n` +
                `Gostaria de agendar uma call para ver os resultados e entender como melhorar nossa segurança.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-base font-bold text-white bg-[#25D366] hover:bg-[#20BA5A] transition-all"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Falar com Especialista no WhatsApp
            </a>
          </div>

          <p className="text-xs text-[#52525b]">
            Sem compromisso • Resposta em até 24h • 100% confidencial
          </p>
        </div>
      </div>
    )
  }

  if (showQuiz) {
    // QUIZ MODE
    const currentQuestion = QUESTIONS[currentStep - 1]
    const isFormStep = currentStep > QUESTIONS.length

    return (
      <div className="min-h-screen bg-[#09090b]">
        {/* Progress */}
        <div className="sticky top-0 z-50 bg-[rgba(9,9,11,0.9)] backdrop-blur-lg border-b border-[#1f1f27] p-4">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-[#71717a] font-mono">Progresso</span>
              <span className="text-xs text-[#a1a1aa] font-mono">{progress}%</span>
            </div>
            <div className="h-1 bg-[#1f1f27] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#dc2626] to-[#ef4444] transition-all duration-300" style={{ width: progress + '%' }} />
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto p-6 pt-12">
          {isFormStep ? (
            // FORM
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-6">Seus dados para o diagnóstico</h2>
              
              <input
                type="text"
                placeholder="Seu nome"
                required
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[#111113] border border-[#2a2a32] text-white placeholder-[#71717a] focus:border-[#dc2626] focus:outline-none"
              />
              
              <input
                type="text"
                placeholder="Nome da empresa"
                required
                value={formData.company}
                onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[#111113] border border-[#2a2a32] text-white placeholder-[#71717a] focus:border-[#dc2626] focus:outline-none"
              />
              
              <input
                type="email"
                placeholder="E-mail corporativo"
                required
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[#111113] border border-[#2a2a32] text-white placeholder-[#71717a] focus:border-[#dc2626] focus:outline-none"
              />
              
              <input
                type="tel"
                placeholder="Telefone com DDD"
                required
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[#111113] border border-[#2a2a32] text-white placeholder-[#71717a] focus:border-[#dc2626] focus:outline-none"
              />
              
              <input
                type="url"
                placeholder="Site da empresa (https://...)"
                value={formData.site_url}
                onChange={e => setFormData(prev => ({ ...prev, site_url: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-[#111113] border border-[#2a2a32] text-white placeholder-[#71717a] focus:border-[#dc2626] focus:outline-none"
              />

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.authorize_test}
                  onChange={e => setFormData(prev => ({ ...prev, authorize_test: e.target.checked }))}
                  className="mt-1 w-4 h-4 accent-[#dc2626]"
                />
                <span className="text-sm text-[#d1d5db] leading-relaxed">
                  <strong>Declaro que sou responsável pelo site informado acima</strong> e autorizo a realização de testes de segurança controlados.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-base font-bold text-white bg-[#dc2626] hover:bg-[#ef4444] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Processando...' : 'Gerar Meu Diagnóstico →'}
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(QUESTIONS.length)}
                className="w-full py-2.5 text-sm text-[#a1a1aa] hover:text-white transition-colors"
              >
                ← Voltar
              </button>
            </form>
          ) : (
            // QUESTION
            <div key={currentQuestion.id}>
              <h2 className="text-xl font-bold mb-6">{currentQuestion.question}</h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      answers[currentQuestion.id as keyof Answers] === option.value
                        ? 'bg-[rgba(220,38,38,0.12)] border-[#dc2626] text-white'
                        : 'bg-[#111113] border-[#2a2a32] text-[#d1d5db] hover:border-[#3a3a42]'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(prev => prev - 1)}
                  className="mt-6 text-sm text-[#a1a1aa] hover:text-white transition-colors"
                >
                  ← Voltar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // LANDING PAGE
  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] font-sans">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1f1f27] bg-[rgba(9,9,11,0.7)] backdrop-blur-lg">
        <div className="max-w-[1180px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-[6px] bg-[#dc2626] flex items-center justify-center">
              <ShieldIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight">
              Patolino<span className="text-[#ef4444]">.Security</span>
            </span>
          </div>
          <button
            onClick={() => { setCurrentStep(1); setShowQuiz(true); }}
            className="text-xs font-semibold tracking-wider uppercase px-5 py-2 rounded-lg bg-[#dc2626] text-white hover:bg-[#ef4444] transition-all"
          >
            Agendar Diagnóstico
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="relative z-10 max-w-[760px] mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(220,38,38,0.12)] border border-[rgba(220,38,38,0.3)] mb-8">
            <span className="w-1.5 h-1.5 bg-[#f59e0b] rounded-full animate-pulse" />
            <span className="text-[#f59e0b] text-xs font-medium tracking-wide">
              Diagnóstico gratuito — restam 3 vagas em maio
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
            Alguém já está tentando<br />
            <span className="bg-gradient-to-br from-[#ef4444] via-[#fb923c] to-[#ef4444] bg-clip-text text-transparent">
              invadir sua empresa.
            </span>
          </h1>

          <p className="text-lg text-[#a1a1aa] leading-relaxed max-w-[580px] mx-auto mb-10">
            Descubra as portas abertas no seu negócio antes que alguém mal-intencionado as encontre. Um vazamento de dados custa em média <strong className="text-white">R$ 21,5 milhões</strong> — e pode fechar sua empresa.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => { setCurrentStep(1); setShowQuiz(true); }}
              className="inline-flex items-center gap-2 text-base font-bold px-8 py-4 rounded-xl bg-[#dc2626] text-white hover:bg-[#ef4444] hover:shadow-[0_0_40px_rgba(220,38,38,0.25)] transition-all animate-pulse"
            >
              Quero Saber Se Estou Seguro →
            </button>
            <a href="#como-funciona" className="text-sm font-medium text-[#71717a] hover:text-[#a1a1aa] transition-colors px-6 py-4">
              Como funciona ↓
            </a>
          </div>

          <p className="mt-8 text-[11px] text-[#52525b] tracking-wide">
            Sem compromisso • Resultado em até 10 dias úteis • 100% confidencial • <span className="text-[#f59e0b]">Apenas 3 vagas restantes</span>
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-t border-b border-[#1f1f27] bg-[#111113]">
        <div className="max-w-[1180px] mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#ef4444] to-[#fb923c] bg-clip-text text-transparent">R$ 21,5M</div>
              <div className="text-[13px] text-[#71717a] mt-1 leading-snug">Custo médio de um vazamento de dados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#ef4444] to-[#fb923c] bg-clip-text text-transparent">197 dias</div>
              <div className="text-[13px] text-[#71717a] mt-1 leading-snug">Até uma invasão ser percebida</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#ef4444] to-[#fb923c] bg-clip-text text-transparent">60%</div>
              <div className="text-[13px] text-[#71717a] mt-1 leading-snug">Das empresas fecham após um ataque</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-[#ef4444] to-[#fb923c] bg-clip-text text-transparent">91%</div>
              <div className="text-[13px] text-[#71717a] mt-1 leading-snug">Dos ataques começam por e-mail (phishing)</div>
            </div>
          </div>
        </div>
      </section>

      {/* RISCO REAL */}
      <section className="py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="max-w-[640px] mx-auto text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#ef4444] mb-4">O Risco é Real</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4">
              O que acontece quando você
              <span className="bg-gradient-to-br from-[#ef4444] via-[#fb923c] to-[#ef4444] bg-clip-text text-transparent"> não se protege</span>
            </h2>
            <p className="text-base text-[#a1a1aa] leading-relaxed">
              Achar que "não vai acontecer comigo" é o que toda empresa achava antes de ser atacada. O custo de reagir é sempre maior que o de prevenir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="group bg-[#111113] border border-[#2a2a32] rounded-2xl p-8 hover:border-[rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.12)] transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 bg-[rgba(220,38,38,0.1)]">
                <AlertCircleIcon className="text-[#ef4444]" />
              </div>
              <h3 className="text-[17px] font-bold tracking-tight mb-3">Multa LGPD de até 2% do faturamento</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">Se os dados dos seus clientes vazarem, a Lei Geral de Proteção de Dados pode multar sua empresa em até R$ 50 milhões por infração.</p>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#111113] border border-[#2a2a32] rounded-2xl p-8 hover:border-[rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.12)] transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 bg-[rgba(217,119,6,0.1)]">
                <CartIcon className="text-[#f59e0b]" />
              </div>
              <h3 className="text-[17px] font-bold tracking-tight mb-3">Você pode ser processado pessoalmente</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">Em mais de 100 países, donos e diretores de empresa respondem com o próprio patrimônio por falhas de segurança.</p>
            </div>

            {/* Card 3 */}
            <div className="group bg-[#111113] border border-[#2a2a32] rounded-2xl p-8 hover:border-[rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.12)] transition-all">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5 bg-[rgba(239,68,68,0.1)]">
                <span className="text-[#ef4444] text-xl">💀</span>
              </div>
              <h3 className="text-[17px] font-bold tracking-tight mb-3">60% das empresas fecham em 6 meses</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed">Após um ataque sério, a maioria não consegue se recuperar — perde clientes, reputação e faturamento.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-24 bg-[#111113]">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="max-w-[640px] mx-auto text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#ef4444] mb-4">Processo Simples</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4">
              Como funciona o
              <span className="bg-gradient-to-br from-[#ef4444] via-[#fb923c] to-[#ef4444] bg-clip-text text-transparent"> diagnóstico</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Você responde o questionário', desc: '5 perguntas rápidas sobre sua empresa e preocupações de segurança.' },
              { step: '02', title: 'Nós analisamos seu site', desc: 'Rodamos ferramentas profissionais de segurança para identificar falhas reais.' },
              { step: '03', title: 'Você recebe o diagnóstico', desc: 'Relatório claro com prioridades + call gratuita para discutir próximos passos.' }
            ].map((item) => (
              <div key={item.step} className="bg-[#09090b] rounded-2xl p-8 border border-[#2a2a32]">
                <div className="text-3xl font-bold text-[#2a2a32] mb-4 font-mono">{item.step}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-[#a1a1aa]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA */}
      <section className="py-24">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* O que você ganha */}
            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4ade80] mb-4">O que você ganha</p>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  Diagnóstico completo<br />
                  <span className="bg-gradient-to-br from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">sem pagar nada</span>
                </h2>
              </div>

              <div className="space-y-4">
                {[
                  'Mapeamento completo das falhas mais perigosas do seu site',
                  'Relatório com prioridades claras em linguagem que você entende',
                  'Análise de pontos de entrada que um atacante usaria',
                  'Recomendações práticas que você pode aplicar hoje',
                  'Call gratuita de 15 minutos para discutir os resultados'
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckIcon className="w-4 h-4 mt-1 text-[#4ade80] flex-shrink-0" />
                    <span className="text-sm text-[#d1d5db]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[rgba(34,197,94,0.06)] border border-[rgba(34,197,94,0.15)]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckIcon className="w-4 h-4 text-[#4ade80]" />
                  <span className="text-[13px] font-bold text-[#4ade80]">Seu diagnóstico: R$ 0</span>
                </div>
                <p className="text-[12px] text-[#86efac] leading-relaxed">
                  Isso mesmo — você recebe o diagnóstico completo sem pagar nada. Depois, você decide se quer investir na correção. Sem pegadinha.
                </p>
              </div>
            </div>

            {/* Card de oferta */}
            <div className="bg-[#09090b] rounded-2xl p-8 border border-[#2a2a32] relative">
              <div className="absolute -top-3 right-6 bg-[#dc2626] text-white text-[10px] font-bold tracking-wider uppercase px-4 py-1 rounded-full animate-pulse">
                GRATUITO
              </div>
              
              <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#f59e0b] mb-3">Oferta por tempo limitado</p>
              <h3 className="text-2xl font-extrabold tracking-tight mb-2">Diagnóstico de segurança</h3>
              
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-[13px] text-[#52525b] line-through">R$ 8.000</span>
                <span className="text-4xl font-extrabold text-[#4ade80]">R$ 0</span>
              </div>

              <p className="text-sm text-[#a1a1aa] leading-relaxed mb-6">
                Nós avaliamos seu site, identificamos as falhas mais críticas e te entregamos um relatório com prioridades — sem custo.
              </p>

              <div className="p-4 rounded-xl bg-[rgba(217,119,6,0.08)] border border-[rgba(217,119,6,0.2)] mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <ClockIcon className="w-4 h-4 text-[#f59e0b]" />
                  <span className="text-[13px] font-bold text-[#fbbf24]">Vagas encerram em breve</span>
                </div>
                <p className="text-[13px] text-[#fcd34d] leading-relaxed">
                  Apenas 5 empresas por mês recebem o diagnóstico gratuito.
                </p>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-[#71717a]">2 de 5 vagas preenchidas</span>
                  <span className="text-[11px] font-bold text-[#f59e0b]">3 restantes</span>
                </div>
                <div className="h-2 bg-[#1f1f27] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ef4444] rounded-full" style={{ width: '40%' }} />
                </div>
              </div>

              <button
                onClick={() => { setCurrentStep(1); setShowQuiz(true); }}
                className="block w-full py-3.5 rounded-xl text-base font-bold text-white bg-[#dc2626] hover:bg-[#ef4444] hover:shadow-[0_0_40px_rgba(220,38,38,0.25)] transition-all text-center"
              >
                Garantir Minha Vaga Gratuita →
              </button>
              
              <p className="text-center text-[11px] text-[#52525b] mt-2">
                Depois que as 5 vagas acabam, essa oferta some.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-[#111113]">
        <div className="max-w-[720px] mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#ef4444] mb-4">Dúvidas</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              Perguntas
              <span className="bg-gradient-to-br from-[#ef4444] via-[#fb923c] to-[#ef4444] bg-clip-text text-transparent"> frequentes</span>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: 'O diagnóstico é realmente gratuito?', a: 'Sim. Você não paga nada pelo diagnóstico. Se quiser contratar nossos serviços para corrigir as falhas, aí sim conversamos sobre valores — mas o diagnóstico em si é 100% gratuito.' },
              { q: 'Vocês vão invadir meu site?', a: 'Não. Fazemos testes controlados que não afetam a operação do seu site. Identificamos vulnerabilidades sem explorá-las de forma destrutiva.' },
              { q: 'Quanto tempo demora?', a: 'O diagnóstico leva de 5 a 10 dias úteis. Você recebe um relatório completo com todas as falhas encontradas e recomendações.' },
              { q: 'Meus dados estão seguros?', a: 'Sim. Tudo o que compartilhar conosco é 100% confidencial. Não vendemos, compartilhamos ou divulgamos suas informações.' },
              { q: 'Por que apenas 5 vagas por mês?', a: 'Porque cada diagnóstico leva tempo e atenção dedicada. Queremos entregar qualidade, não volume. Quando as vagas acabam, só no mês seguinte.' }
            ].map((faq, i) => (
              <div key={i} className="bg-[#09090b] border border-[#2a2a32] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-[15px]">{faq.q}</span>
                  <span className="text-[#71717a] text-xl">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-sm text-[#a1a1aa] leading-relaxed border-t border-[#2a2a32] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24">
        <div className="max-w-[640px] mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-6">
            Ainda tem dúvida se precisa de segurança?
          </h2>
          <p className="text-lg text-[#a1a1aa] mb-8">
            A resposta é: sim, precisa. Toda empresa que lida com dados de clientes precisa de segurança. A única pergunta real é: você vai descobrir as falhas antes ou depois de um ataque?
          </p>
          <button
            onClick={() => { setCurrentStep(1); setShowQuiz(true); }}
            className="inline-flex items-center gap-2 text-base font-bold px-8 py-4 rounded-xl bg-[#dc2626] text-white hover:bg-[#ef4444] hover:shadow-[0_0_40px_rgba(220,38,38,0.25)] transition-all"
          >
            Descobrir Minhas Falhas Agora →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#1f1f27] py-10">
        <div className="max-w-[1180px] mx-auto px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[3px] bg-[#dc2626] flex items-center justify-center">
              <ShieldIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-[13px] font-semibold">
              Patolino<span className="text-[#ef4444]">.Security</span>
            </span>
          </div>
          <p className="text-xs text-[#52525b]">Segurança que funciona. Sem desculpas.</p>
          <p className="text-xs text-[#3f3f46]">© 2025 Patolino.Security</p>
        </div>
      </footer>
    </div>
  )
}
