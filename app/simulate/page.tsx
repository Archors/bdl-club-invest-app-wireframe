'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Slider } from '@/components/ui/Slider'
import { useSimulation } from '@/hooks/useSimulation'
import { cn } from '@/lib/cn'
import type { RiskProfileType } from '@/domain/types'

const riskProfiles = [
  {
    value: 'tempere' as RiskProfileType,
    name: 'Tempéré',
    risk: '3/7',
    objective: '5%',
    description: 'Croissance régulière avec volatilité maîtrisée',
  },
  {
    value: 'audacieux' as RiskProfileType,
    name: 'Audacieux',
    risk: '5/7',
    objective: '8%',
    description: 'Performance maximale avec volatilité plus élevée',
  },
]

export default function SimulatePage() {
  const router = useRouter()
  const { params, updateParams, calculate } = useSimulation()

  const handleCalculate = () => {
    const result = calculate()
    sessionStorage.setItem('simulation_result', JSON.stringify(result))
    router.push('/simulate/result')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <Image src="/image.webp" alt="Club Invest" width={80} height={22} />
          </Link>
          <h1 className="text-base font-semibold text-text">Simulateur</h1>
        </div>
      </header>

      <main className="px-4 py-6">

        {/* Form */}
        <div className="space-y-6">
          <Card>
            <div className="space-y-6">
              <Slider
                label="Versement initial"
                value={params.initialAmount}
                onChange={(value) => updateParams({ initialAmount: value })}
                min={0}
                max={100000}
                step={1000}
                formatValue={(v) => `${v.toLocaleString('fr-FR')} €`}
              />
              <Slider
                label="Versement mensuel"
                value={params.monthlyAmount}
                onChange={(value) => updateParams({ monthlyAmount: value })}
                min={0}
                max={2000}
                step={50}
                formatValue={(v) => `${v.toLocaleString('fr-FR')} €`}
              />
              <Slider
                label="Horizon d'investissement"
                value={params.horizonYears}
                onChange={(value) => updateParams({ horizonYears: value })}
                min={5}
                max={20}
                step={1}
                formatValue={(v) => `${v} ans`}
              />
            </div>
          </Card>

          {/* Risk Profile Selector */}
          <div>
            <p className="text-sm font-medium text-text mb-3">Profil de risque</p>
            <div className="space-y-3">
              {riskProfiles.map((profile) => {
                const isSelected = params.riskProfile === profile.value
                return (
                  <button
                    key={profile.value}
                    onClick={() => updateParams({ riskProfile: profile.value })}
                    className={cn(
                      'w-full p-4 rounded-2xl text-left transition-all',
                      'border-2',
                      isSelected
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-surface-solid hover:border-text-muted'
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text">{profile.name}</span>
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          isSelected ? 'bg-accent/20 text-accent' : 'bg-white/10 text-text-muted'
                        )}>
                          Risque {profile.risk}
                        </span>
                      </div>
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                        isSelected ? 'border-accent' : 'border-text-muted'
                      )}>
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-text-muted mb-2">{profile.description}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-text-subtle">Objectif de performance :</span>
                      <span className={cn(
                        'text-sm font-bold',
                        isSelected ? 'text-accent' : 'text-text'
                      )}>
                        {profile.objective}/an
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-text-subtle mt-2 text-center">
              Les objectifs de performance ne sont pas garantis
            </p>
          </div>

          <Button onClick={handleCalculate} fullWidth variant="gradient" size="lg">
            Calculer ma simulation
          </Button>
        </div>
      </main>
    </div>
  )
}
