'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useContracts } from '@/hooks/useContracts'
import { formatCurrency } from '@/domain/utils/formatters'

type Step = 1 | 2 | 3

const frequencies = [
  { value: 'mensuel', label: 'Mensuel' },
  { value: 'trimestriel', label: 'Trimestriel' },
  { value: 'semestriel', label: 'Semestriel' },
]

const dayOptions = [
  { value: '1', label: '1er du mois' },
  { value: '5', label: '5 du mois' },
  { value: '10', label: '10 du mois' },
  { value: '15', label: '15 du mois' },
  { value: '20', label: '20 du mois' },
]

export default function ScheduledDepositPage() {
  const router = useRouter()
  const { contracts } = useContracts()
  const [step, setStep] = useState<Step>(1)

  const [contractId, setContractId] = useState('')
  const [amount, setAmount] = useState('')
  const [frequency, setFrequency] = useState('mensuel')
  const [dayOfMonth, setDayOfMonth] = useState('1')

  const [error, setError] = useState('')

  const contractOptions = contracts.map((c) => ({
    value: c.id,
    label: `${c.label} (${formatCurrency(c.currentValue)})`,
  }))

  const selectedContract = contracts.find((c) => c.id === contractId)

  const validateStep1 = () => {
    if (!contractId) {
      setError('Veuillez sélectionner un contrat')
      return false
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum < 50) {
      setError('Le montant minimum est de 50 €')
      return false
    }
    if (amountNum > 10000) {
      setError('Le montant maximum est de 10 000 €')
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step)
      setError('')
    }
  }

  const handleSubmit = () => {
    const freqLabel = frequencies.find((f) => f.value === frequency)?.label
    alert(`Versement programmé de ${formatCurrency(parseFloat(amount))} / ${freqLabel} sur ${selectedContract?.label} - POC (non exécuté)`)
    router.push('/app')
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s < step ? 'bg-accent text-white' :
              s === step ? 'bg-primary text-white' :
              'bg-surface-solid text-text-muted'
            }`}>
              {s < step ? '✓' : s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 rounded ${s < step ? 'bg-accent' : 'bg-surface-solid'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Contract */}
      {step === 1 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Choisir un contrat</h2>
          <p className="text-text-muted mb-6">Sur quel contrat souhaitez-vous programmer un versement ?</p>

          <Select
            label="Contrat"
            options={contractOptions}
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            placeholder="Sélectionner un contrat"
          />

          {error && <p className="text-danger text-sm mt-2">{error}</p>}

          <Button onClick={handleNext} fullWidth className="mt-6">
            Continuer
          </Button>
        </Card>
      )}

      {/* Step 2: Amount & Frequency */}
      {step === 2 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Paramétrer le versement</h2>
          <p className="text-text-muted mb-6">
            Contrat : <strong>{selectedContract?.label}</strong>
          </p>

          <Input
            label="Montant par échéance"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="200"
            hint="Minimum 50 €, maximum 10 000 €"
            rightIcon={<span className="text-text-muted">€</span>}
          />

          <Select
            label="Fréquence"
            options={frequencies}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            className="mt-4"
          />

          <Select
            label="Jour de prélèvement"
            options={dayOptions}
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="mt-4"
          />

          {error && <p className="text-danger text-sm mt-2">{error}</p>}

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={handleBack} fullWidth>
              Retour
            </Button>
            <Button onClick={handleNext} fullWidth>
              Continuer
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Confirmation</h2>
          <p className="text-text-muted mb-6">Vérifiez les paramètres de votre versement programmé.</p>

          <div className="space-y-4 p-4 bg-white/5 rounded-xl border border-border">
            <div className="flex justify-between">
              <span className="text-text-muted">Contrat</span>
              <span className="font-medium text-text">{selectedContract?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Montant</span>
              <span className="font-bold text-xl text-accent">{formatCurrency(parseFloat(amount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Fréquence</span>
              <span className="font-medium text-text">
                {frequencies.find((f) => f.value === frequency)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Jour de prélèvement</span>
              <span className="font-medium text-text">
                {dayOptions.find((d) => d.value === dayOfMonth)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Mode</span>
              <span className="font-medium text-text">Prélèvement automatique</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-accent/10 rounded-xl text-sm text-text-muted border border-accent/20">
            <p className="font-medium text-text">Bon à savoir</p>
            <p className="mt-1">Vous pouvez modifier ou suspendre votre versement programmé à tout moment depuis votre espace.</p>
          </div>

          <div className="mt-4 p-4 bg-white/5 rounded-xl text-sm text-text-muted border border-border">
            <p className="font-medium text-text">Information</p>
            <p className="mt-1">Ce versement est une démonstration (POC). Aucune transaction réelle ne sera effectuée.</p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={handleBack} fullWidth>
              Modifier
            </Button>
            <Button onClick={handleSubmit} fullWidth>
              Confirmer
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
