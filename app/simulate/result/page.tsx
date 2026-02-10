'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { RISK_RETURNS } from '@/domain/types'
import type { RiskProfileType } from '@/domain/types'

interface SimulationData {
  riskProfile: RiskProfileType
  objectif: string
  initialAmount: number
  monthlyAmount: number
  horizonYears: number
}


function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

export default function SimulationResultPage() {
  const router = useRouter()
  const [data, setData] = useState<SimulationData | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('simulation_params')
    if (stored) {
      setData(JSON.parse(stored))
    } else {
      router.push('/simulate')
    }
  }, [router])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const rate = RISK_RETURNS[data.riskProfile].moyen
  const months = data.horizonYears * 12
  let capital = data.initialAmount
  for (let i = 0; i < months; i++) {
    capital = capital * (1 + rate / 12) + data.monthlyAmount
  }
  const totalDeposits = data.initialAmount + data.monthlyAmount * months
  const gains = capital - totalDeposits
  const profileLabel = data.riskProfile === 'tempere' ? 'Tempéré' : 'Audacieux'

  // Données du graphique année par année
  const chartPoints: { year: number; deposits: number; value: number }[] = []
  for (let y = 0; y <= data.horizonYears; y++) {
    const m = y * 12
    let val = data.initialAmount
    for (let i = 0; i < m; i++) {
      val = val * (1 + rate / 12) + data.monthlyAmount
    }
    const dep = data.initialAmount + data.monthlyAmount * m
    chartPoints.push({ year: y, deposits: dep, value: val })
  }

  const maxValue = Math.max(...chartPoints.map((p) => p.value)) * 1.1
  const chartW = 320
  const chartH = 180
  const padL = 0
  const padR = 0
  const padT = 10
  const padB = 24

  const toX = (year: number) => padL + (year / data.horizonYears) * (chartW - padL - padR)
  const toY = (val: number) => padT + (1 - val / maxValue) * (chartH - padT - padB)

  const valuePath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.year)},${toY(p.value)}`).join(' ')
  const depositsPath = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${toX(p.year)},${toY(p.deposits)}`).join(' ')

  const valueAreaPath = `${valuePath} L${toX(data.horizonYears)},${toY(0)} L${toX(0)},${toY(0)} Z`
  const depositsAreaPath = `${depositsPath} L${toX(data.horizonYears)},${toY(0)} L${toX(0)},${toY(0)} Z`

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/15">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/simulate" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/70">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="text-white/70 text-sm">Modifier</span>
          </Link>
          <h1 className="text-base font-semibold text-white">Votre proposition</h1>
        </div>
      </header>

      <main className="px-4 py-6 space-y-6">
        {/* Résumé simulation */}
        <div className="text-center">
          <p className="text-white/70 text-sm mb-1">Capital estimé dans {data.horizonYears} ans</p>
          <p className="text-4xl font-bold text-white">{formatCurrency(capital)}</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div>
              <p className="text-xs text-white/60">Total versé</p>
              <p className="text-base font-semibold text-white">{formatCurrency(totalDeposits)}</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="text-xs text-white/60">Gains estimés</p>
              <p className="text-base font-semibold text-success-light">+{formatCurrency(gains)}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-medium border border-white/20">
              Profil {profileLabel} &middot; {(rate * 100).toFixed(0)}%/an
            </span>
          </div>
        </div>

        {/* Graphique évolution */}
        <Card>
          <h3 className="font-semibold text-text mb-4">Évolution de votre épargne</h3>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="gainGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-light)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="var(--accent-light)" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="depositGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--beige)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--beige)" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            {/* Lignes horizontales */}
            {[0.25, 0.5, 0.75].map((frac) => (
              <line
                key={frac}
                x1={padL}
                y1={toY(maxValue * frac)}
                x2={chartW - padR}
                y2={toY(maxValue * frac)}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="4 4"
              />
            ))}

            {/* Aire gains (total value) */}
            <path d={valueAreaPath} fill="url(#gainGrad)" />
            {/* Aire capital versé */}
            <path d={depositsAreaPath} fill="url(#depositGrad)" />

            {/* Ligne value */}
            <path d={valuePath} fill="none" stroke="var(--accent-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Ligne deposits */}
            <path d={depositsPath} fill="none" stroke="var(--beige)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />

            {/* Points de fin */}
            <circle cx={toX(data.horizonYears)} cy={toY(capital)} r="4" fill="var(--accent-light)" />
            <circle cx={toX(data.horizonYears)} cy={toY(totalDeposits)} r="3.5" fill="var(--beige)" />

            {/* Labels année */}
            {chartPoints.filter((_, i) => i % 2 === 0 || i === chartPoints.length - 1).map((p) => (
              <text
                key={p.year}
                x={toX(p.year)}
                y={chartH - 4}
                textAnchor="middle"
                fill="rgba(255,255,255,0.4)"
                fontSize="10"
                fontFamily="inherit"
              >
                {p.year === 0 ? 'Auj.' : `${p.year}a`}
              </text>
            ))}
          </svg>

          {/* Légende */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-light" />
              <span className="text-xs text-text-muted">Capital total</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-beige" />
              <span className="text-xs text-text-muted">Versements</span>
            </div>
          </div>
        </Card>

        {/* Assurance Vie */}
        <Card>
          <h3 className="font-semibold text-white mb-4">Assurance Vie</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-success mt-0.5">&#10003;</span>
              <span className="text-sm text-white/80">Une fiscalité favorable</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-success mt-0.5">&#10003;</span>
              <span className="text-sm text-white/80">Un outil de transmission incontournable</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-success mt-0.5">&#10003;</span>
              <span className="text-sm text-white/80">Votre argent reste disponible</span>
            </li>
          </ul>
        </Card>

        {/* Disclaimer */}
        <p className="text-[10px] text-white/40 text-center">
          Simulation indicative. Les performances passées ne préjugent pas des performances futures.
        </p>

        {/* CTA Rejoindre le club */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-4 rounded-2xl gradient-cta text-white font-semibold flex items-center justify-center gap-2"
        >
          Rejoindre
          <Image src="/image.webp" alt="Club Invest" width={80} height={22} />
        </button>

        {/* Partenariat Generali */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-[10px] text-white/40">En partenariat avec</span>
          <Image
            src="/Z_0r6evxEdbNPBk9_Assicurazioni_Generali_-logo-.svg"
            alt="Generali"
            width={60}
            height={16}
            className="brightness-0 invert opacity-40"
          />
        </div>
      </main>

      {/* Pop-up inscription */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Rejoindre le club">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-text mb-2">Plus facile sur ordinateur</h3>
            <p className="text-sm text-text-muted">
              Pour une expérience optimale, nous vous recommandons de finaliser votre inscription depuis un ordinateur.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-surface-solid border border-border">
            <p className="text-xs text-text-subtle mb-1">Rendez-vous sur</p>
            <p className="text-sm font-semibold text-primary">www.bdlclubinvest.fr</p>
          </div>
          <Button onClick={() => setShowModal(false)} fullWidth variant="secondary">
            Compris
          </Button>
        </div>
      </Modal>
    </div>
  )
}
