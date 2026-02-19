'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

// ─── Calcul identique au site Club Invest ───────────────────────────────────
function calculateChartData(initial: number, monthly: number, horizon: number, rate: number) {
  let contributions = initial
  let value = initial
  const data: { year: number; totalValue: number; returns: number }[] = []
  for (let year = 1; year <= horizon; year++) {
    for (let month = 1; month <= 12; month++) {
      value += monthly
      value *= 1 + rate / 12
      contributions += monthly
    }
    data.push({ year, totalValue: value, returns: value - contributions })
  }
  return data
}

function calculateSimulation(initial: number, monthly: number, horizon: number, rate: number) {
  const data = calculateChartData(initial, monthly, horizon, rate)
  const last = data[data.length - 1]
  const contributions = initial + monthly * 12 * horizon
  return { total: last.totalValue, contributions, returns: last.returns }
}

function fmt(v: number) {
  return Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)
}

// ─── Profils ─────────────────────────────────────────────────────────────────
const PROFILES = [
  {
    id: 'safe' as const,
    name: 'Tempéré',
    rate: 0.05,
    obj: 'Obj. 5%/an',
    risk: 'Risque 3/7',
    tooltip: "Ce portefeuille vise un rendement cible de 5% par an. Cet objectif n'est pas garanti. Le niveau de risque 3/7 indique une exposition modérée au risque de perte en capital.",
  },
  {
    id: 'balanced' as const,
    name: 'Audacieux',
    rate: 0.08,
    obj: 'Obj. 8%/an',
    risk: 'Risque 5/7',
    tooltip: "Ce portefeuille vise un rendement cible de 8% par an. Cet objectif n'est pas garanti. Le niveau de risque 5/7 indique une exposition élevée au risque de perte en capital.",
  },
]

// ─── Icônes jauge (speed-test-left / right) ──────────────────────────────────
function GaugeLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 13C5 9.13 8.13 6 12 6s7 3.13 7 7" stroke="#A77958" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 13L8.5 9.5" stroke="#A77958" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="13" r="1.5" fill="#A77958"/>
    </svg>
  )
}
function GaugeRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 13C5 9.13 8.13 6 12 6s7 3.13 7 7" stroke="#A77958" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 13L15.5 9.5" stroke="#A77958" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="12" cy="13" r="1.5" fill="#A77958"/>
    </svg>
  )
}

// ─── SimulatorButton pill (fidèle au design du site) ─────────────────────────
function ProfilePill({
  profile,
  checked,
  onClick,
}: {
  profile: (typeof PROFILES)[0]
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 pl-1 py-1 transition-all active:scale-95"
      style={{
        paddingRight: 40,
        borderRadius: 68,
        border: `1px solid ${checked ? '#3B3663' : '#CFD3E2'}`,
        backgroundColor: checked ? '#F8F9FB' : 'transparent',
      }}
    >
      {/* Badge checkmark */}
      {checked && (
        <div
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: '#2E17D0' }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
      {/* Icon circle */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: checked ? '#DCD3C8' : '#F8F9FB' }}
      >
        {profile.id === 'safe' ? <GaugeLeft /> : <GaugeRight />}
      </div>
      {/* Labels */}
      <div className="flex flex-col items-start gap-0.5">
        <span className="text-[13px] font-medium" style={{ color: '#A77958' }}>{profile.name}</span>
        <span className="text-[10px] font-medium text-text">{profile.obj}</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: checked ? '#A77958' : '#DCD3C8' }} />
          <span className="text-[10px] font-medium text-text-muted">{profile.risk}</span>
        </div>
      </div>
    </button>
  )
}

// ─── Slider avec box valeur (fidèle CISlider du site) ────────────────────────
function SimSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit,
  showInfo,
  onInfoClick,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
  unit: string
  showInfo?: boolean
  onInfoClick?: () => void
}) {
  const pct = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-4 p-3 rounded-xl" style={{ backgroundColor: '#E5E8F2' }}>
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-text">{label}</span>
        {showInfo && (
          <button onClick={onInfoClick} className="w-5 h-5 flex items-center justify-center text-text-muted">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <line x1="12" y1="8" x2="12" y2="12.5"/>
              <circle cx="12" cy="15.5" r="0.5" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="sim-slider flex-1 h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #2E17D0 0%, #2E17D0 ${pct}%, white ${pct}%, white 100%)`,
          }}
        />
        <div
          className="flex items-center gap-1 px-3 py-2.5 rounded-lg shrink-0"
          style={{ backgroundColor: '#F8F9FB', minWidth: 96 }}
        >
          <span className="text-[15px] font-medium text-text">{value.toLocaleString('fr-FR')}</span>
          <span className="text-[15px] font-medium" style={{ color: '#A77958' }}>{unit}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Icône info ───────────────────────────────────────────────────────────────
function InfoIcon({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-5 h-5 flex items-center justify-center text-text-muted">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="3"/>
        <line x1="12" y1="8" x2="12" y2="12.5"/>
        <circle cx="12" cy="15.5" r="0.5" fill="currentColor"/>
      </svg>
    </button>
  )
}

// ─── Formatage compact axe Y ─────────────────────────────────────────────────
function fmtCompact(v: number) {
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(v % 1_000_000 === 0 ? 0 : 1) + ' M€'
  if (v >= 1_000) return Math.round(v / 1_000) + ' k€'
  return v + ' €'
}

// ─── Bar Chart (fidèle au site Club Invest) ───────────────────────────────────
function SimBarChart({ data }: { data: { year: number; totalValue: number; returns: number }[] }) {
  const maxRaw = Math.max(...data.map(d => d.totalValue))
  const max = Math.ceil(maxRaw / 100_000) * 100_000 || 100_000
  const scaleLabels = Array.from({ length: 6 }, (_, i) => max - (max / 5) * i)

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl" style={{ backgroundColor: '#E5E8F2' }}>
      {/* Zone graphique */}
      <div className="flex gap-2">
        {/* Barres */}
        <div className="relative flex-1" style={{ height: 180 }}>
          {/* Lignes de grille */}
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{ top: `${(i / 6) * 100}%`, height: 1, backgroundColor: 'rgba(163,141,121,0.25)' }}
            />
          ))}
          {/* Colonnes */}
          <div className="absolute inset-0 flex items-end" style={{ gap: 2 }}>
            {data.map(entry => {
              const totalH = (entry.totalValue / max) * 100
              const returnsH = entry.totalValue > 0 ? (entry.returns / entry.totalValue) * 100 : 0
              const contributionsH = 100 - returnsH
              return (
                <div key={entry.year} className="flex-1 flex flex-col justify-end" style={{ height: '100%' }}>
                  <div
                    style={{
                      height: `${totalH}%`,
                      borderRadius: '4px 4px 0 0',
                      overflow: 'hidden',
                      transition: 'height 0.8s ease-out',
                    }}
                  >
                    <div style={{
                      height: `${returnsH}%`,
                      background: 'linear-gradient(180deg, rgba(108,90,237,0.70) 0%, rgba(237,235,254,0.70) 100%)',
                    }} />
                    <div style={{ height: `${contributionsH}%`, backgroundColor: '#2E17D0' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Axe Y */}
        <div className="flex flex-col justify-between shrink-0" style={{ width: 48 }}>
          {scaleLabels.map((v, i) => (
            <span key={i} className="text-[9px] text-right leading-none" style={{ color: '#A77958' }}>
              {fmtCompact(v)}
            </span>
          ))}
        </div>
      </div>

      {/* Légende */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ background: 'linear-gradient(180deg, rgba(108,90,237,0.70) 0%, rgba(237,235,254,0.70) 100%)' }} />
          <span className="text-[11px] text-text">Intérêts et plus-values</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: '#2E17D0' }} />
          <span className="text-[11px] text-text">Versements cumulés</span>
        </div>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function SimulatePage() {
  const [risk, setRisk] = useState<'safe' | 'balanced'>('balanced')
  const [initial, setInitial] = useState(20000)
  const [monthly, setMonthly] = useState(300)
  const [horizon, setHorizon] = useState(20)
  const [tooltip, setTooltip] = useState<'profile' | 'monthly' | null>(null)

  const profile = PROFILES.find(p => p.id === risk)!
  const chartData = calculateChartData(initial, monthly, horizon, profile.rate)
  const result = calculateSimulation(initial, monthly, horizon, profile.rate)

  const toggleTip = (key: 'profile' | 'monthly') =>
    setTooltip(prev => (prev === key ? null : key))

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F4EFEB' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          borderRadius: '0 0 24px 24px',
        }}
      >
        <div className="px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <Image src="/image.webp" alt="Club Invest" width={80} height={22} />
          </Link>
          <h1 className="text-base font-semibold text-white">Simulateur</h1>
        </div>
      </header>

      <main className="px-4 py-5 space-y-3 pb-10">

        {/* ── Section profil investisseur ── */}
        <div className="flex flex-col gap-4 p-3 rounded-xl" style={{ backgroundColor: '#E5E8F2' }}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-text">Profil investisseur</span>
            <InfoIcon onClick={() => toggleTip('profile')} />
          </div>
          {tooltip === 'profile' && (
            <div className="px-3 py-2.5 rounded-lg text-xs leading-relaxed text-white" style={{ backgroundColor: '#070231' }}>
              {profile.tooltip}
            </div>
          )}
          <div className="flex flex-col gap-2.5">
            {PROFILES.map(p => (
              <ProfilePill
                key={p.id}
                profile={p}
                checked={risk === p.id}
                onClick={() => { setRisk(p.id); setTooltip(null) }}
              />
            ))}
          </div>
        </div>

        {/* ── Versement initial ── */}
        <SimSlider
          label="Versement initial"
          value={initial}
          onChange={setInitial}
          min={5000}
          max={200000}
          step={1000}
          unit="€"
        />

        {/* ── Versements mensuels ── */}
        <div className="flex flex-col gap-4 p-3 rounded-xl" style={{ backgroundColor: '#E5E8F2' }}>
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-text">Versements mensuels</span>
            <InfoIcon onClick={() => toggleTip('monthly')} />
          </div>
          {tooltip === 'monthly' && (
            <div className="px-3 py-2.5 rounded-lg text-xs leading-relaxed text-white" style={{ backgroundColor: '#070231' }}>
              Mécanisme qui vous permet d'alimenter, de manière automatique et selon un calendrier défini à l'avance, votre placement financier.
            </div>
          )}
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={1000}
              step={100}
              value={monthly}
              onChange={e => setMonthly(Number(e.target.value))}
              className="sim-slider flex-1 h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #2E17D0 0%, #2E17D0 ${(monthly / 1000) * 100}%, white ${(monthly / 1000) * 100}%, white 100%)`,
              }}
            />
            <div className="flex items-center gap-1 px-3 py-2.5 rounded-lg shrink-0" style={{ backgroundColor: '#F8F9FB', minWidth: 96 }}>
              <span className="text-[15px] font-medium text-text">{monthly.toLocaleString('fr-FR')}</span>
              <span className="text-[15px] font-medium" style={{ color: '#A77958' }}>€</span>
            </div>
          </div>
        </div>

        {/* ── Horizon d'investissement ── */}
        <SimSlider
          label="Horizon d'investissement"
          value={horizon}
          onChange={setHorizon}
          min={5}
          max={20}
          step={1}
          unit="ans"
        />

        {/* ── Graphique ── */}
        <SimBarChart data={chartData} />

        {/* ── Carte résultat ── */}
        <div
          className="p-5 rounded-xl flex flex-col gap-6"
          style={{ backgroundColor: '#F8F9FB', border: '1px solid #CFD3E2' }}
        >
          {/* Capital total */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[13px] font-medium text-center" style={{ color: '#3B3663' }}>
              Votre Capital dans {horizon} ans
            </span>
            <span className="text-4xl font-bold" style={{ color: '#2E17D0' }}>
              {fmt(result.total)}
            </span>
          </div>

          {/* Détail */}
          <div className="flex flex-col" style={{ borderTop: '1px solid #CFD3E2' }}>
            <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid #CFD3E2' }}>
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                  style={{
                    background: 'linear-gradient(180deg, rgba(108,90,237,0.70) 0%, rgba(237,235,254,0.70) 100%)',
                  }}
                />
                <span className="text-[13px]" style={{ color: '#7C789A' }}>Intérêts et plus-values</span>
              </div>
              <span className="text-[15px] font-medium" style={{ color: '#A77958' }}>
                {fmt(result.returns)}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-[3px] shrink-0" style={{ backgroundColor: '#2E17D0' }} />
                <span className="text-[13px]" style={{ color: '#7C789A' }}>Versements cumulés</span>
              </div>
              <span className="text-[15px] font-medium" style={{ color: '#A77958' }}>
                {fmt(result.contributions)}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-center" style={{ color: '#7C789A' }}>
          Les objectifs de performance ne sont pas garantis. Les performances passées ne préjugent pas des performances futures.
        </p>

        {/* CTA */}
        <button className="w-full py-4 rounded-2xl gradient-cta text-white font-semibold text-base">
          Rejoindre Club Invest
        </button>
      </main>
    </div>
  )
}
