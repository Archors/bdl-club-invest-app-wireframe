'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Slider } from '@/components/ui/Slider'
import { cn } from '@/lib/cn'
import type { RiskProfileType } from '@/domain/types'

type ObjectifType = 'epargne' | 'retraite'

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

const objectifs = [
  {
    value: 'epargne' as ObjectifType,
    name: 'Investir mon épargne',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.4-11-.5-12 5 0 0 2.5-1.5 6 0 3.5 1.5 5 .5 7-2 2-2.5 4-2 5 0" />
        <path d="M2 22c1-3 4-6 8-6s7 3 8 6" />
      </svg>
    ),
    description: 'Faire fructifier votre capital sur le long terme',
  },
  {
    value: 'retraite' as ObjectifType,
    name: 'Préparer ma retraite',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    description: 'Constituer un complément de revenus pour votre retraite',
  },
]

export default function SimulatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [riskProfile, setRiskProfile] = useState<RiskProfileType>('tempere')
  const [objectif, setObjectif] = useState<ObjectifType>('epargne')
  const [initialAmount, setInitialAmount] = useState(10000)
  const [monthlyAmount, setMonthlyAmount] = useState(200)
  const [showVlpTip, setShowVlpTip] = useState(false)

  const handleNext = () => {
    setStep(2)
  }

  const handleDiscover = () => {
    const data = {
      riskProfile,
      objectif,
      initialAmount,
      monthlyAmount,
      horizonYears: 10,
    }
    sessionStorage.setItem('simulation_params', JSON.stringify(data))
    router.push('/simulate/result')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/15">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href={step === 2 ? '#' : '/'} onClick={step === 2 ? (e) => { e.preventDefault(); setStep(1) } : undefined} className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            {step === 1 ? (
              <Image src="/image.webp" alt="Club Invest" width={80} height={22} />
            ) : (
              <span className="text-text-muted text-sm">Retour</span>
            )}
          </Link>
          <h1 className="text-base font-semibold text-text">Découvrir</h1>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-6">
          <div className={cn('flex-1 h-1 rounded-full', step >= 1 ? 'bg-accent-light' : 'bg-white/20')} />
          <div className={cn('flex-1 h-1 rounded-full', step >= 2 ? 'bg-accent-light' : 'bg-white/20')} />
        </div>

        {step === 1 ? (
          /* Step 1: Questionnaire */
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Votre profil</h2>
              <p className="text-text-muted text-sm">Répondez à ces 2 questions pour personnaliser votre proposition.</p>
            </div>

            {/* Question 1: Profil investisseur */}
            <div>
              <p className="text-sm font-medium text-text mb-3">Quel est votre profil investisseur ?</p>
              <div className="space-y-3">
                {riskProfiles.map((profile) => {
                  const isSelected = riskProfile === profile.value
                  return (
                    <button
                      key={profile.value}
                      onClick={() => setRiskProfile(profile.value)}
                      className={cn(
                        'w-full p-4 rounded-2xl text-left transition-all duration-200',
                        'border-2 backdrop-blur-md',
                        isSelected
                          ? 'border-accent-light bg-accent/20 scale-[1.02] shadow-[0_0_20px_rgba(90,69,232,0.25)]'
                          : 'border-white/10 bg-white/5 opacity-60 hover:opacity-80'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text">{profile.name}</span>
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            isSelected ? 'bg-accent/20 text-accent-light' : 'bg-white/15 text-white/70'
                          )}>
                            Risque {profile.risk}
                          </span>
                        </div>
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-white/30 shrink-0" />
                        )}
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
            </div>

            {/* Question 2: Objectif d'investissement */}
            <div>
              <p className="text-sm font-medium text-text mb-3">Quel est votre objectif d&apos;investissement ?</p>
              <div className="space-y-3">
                {objectifs.map((obj) => {
                  const isSelected = objectif === obj.value
                  return (
                    <button
                      key={obj.value}
                      onClick={() => setObjectif(obj.value)}
                      className={cn(
                        'w-full p-4 rounded-2xl text-left transition-all duration-200',
                        'border-2 backdrop-blur-md',
                        isSelected
                          ? 'border-accent-light bg-accent/20 scale-[1.02] shadow-[0_0_20px_rgba(90,69,232,0.25)]'
                          : 'border-white/10 bg-white/5 opacity-60 hover:opacity-80'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center',
                            isSelected ? 'bg-accent/20 text-accent-light' : 'bg-white/15 text-white/70'
                          )}>
                            {obj.icon}
                          </div>
                          <div>
                            <span className="font-semibold text-text block">{obj.name}</span>
                            <span className="text-xs text-text-muted">{obj.description}</span>
                          </div>
                        </div>
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-white/30 shrink-0" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <Button onClick={handleNext} fullWidth variant="gradient" size="lg">
              Suivant
            </Button>
          </div>
        ) : (
          /* Step 2: Montant */
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-text mb-1">Votre investissement</h2>
              <p className="text-text-muted text-sm">Définissez le montant de votre placement.</p>
            </div>

            <Card>
              <div className="space-y-6">
                <Slider
                  label="Versement initial"
                  value={initialAmount}
                  onChange={(value) => setInitialAmount(value)}
                  min={5000}
                  max={100000}
                  step={1000}
                  formatValue={(v) => `${v.toLocaleString('fr-FR')} €`}
                />
                <Slider
                  label="Versement mensuel"
                  value={monthlyAmount}
                  onChange={(value) => {
                    setMonthlyAmount(value)
                    if (value > 0) setShowVlpTip(false)
                  }}
                  min={0}
                  max={2000}
                  step={50}
                  formatValue={(v) => `${v.toLocaleString('fr-FR')} €`}
                />
              </div>
            </Card>

            {/* L'astuce de l'expert - si pas de VLP */}
            {monthlyAmount === 0 && !showVlpTip && (
              <button
                onClick={() => setShowVlpTip(true)}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-accent/40 bg-accent/5 text-left transition-all hover:border-accent hover:bg-accent/10"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-accent block text-sm">L&apos;astuce de l&apos;expert</span>
                    <span className="text-xs text-text-muted">Découvrez comment booster vos rendements</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent shrink-0 ml-auto">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            )}

            {showVlpTip && monthlyAmount === 0 && (
              <Card className="border-2 border-accent/30">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-accent font-semibold text-sm">L&apos;astuce de l&apos;expert</span>
                  </div>
                  <p className="text-sm text-text">
                    Mettez en place un <strong>versement libre programmé (VLP)</strong> pour booster vos rendements !
                  </p>
                  <ul className="space-y-2 text-xs text-text-muted">
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">&#10003;</span>
                      <span>Lissez votre investissement dans le temps pour réduire le risque</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">&#10003;</span>
                      <span>Profitez de l&apos;effet des intérêts composés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent mt-0.5">&#10003;</span>
                      <span>Dès 50&nbsp;€/mois, constituez un capital significatif</span>
                    </li>
                  </ul>
                  <Button
                    onClick={() => { setMonthlyAmount(200); setShowVlpTip(false) }}
                    fullWidth
                    variant="secondary"
                    size="sm"
                  >
                    Ajouter un versement mensuel
                  </Button>
                </div>
              </Card>
            )}

            <Button onClick={handleDiscover} fullWidth variant="gradient" size="lg">
              Découvrir la proposition
            </Button>

            <p className="text-xs text-text-subtle text-center">
              Les objectifs de performance ne sont pas garantis
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
