'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useContracts } from '@/hooks/useContracts'
import { formatCurrency } from '@/domain/utils/formatters'

type Step = 1 | 2 | 3

const paymentMethods = [
  { value: 'virement', label: 'Virement bancaire' },
  { value: 'prelevement', label: 'Prélèvement automatique' },
  { value: 'cheque', label: 'Chèque' },
]

export default function DepositPage() {
  const router = useRouter()
  const { contracts } = useContracts()
  const [step, setStep] = useState<Step>(1)

  const [contractId, setContractId] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('virement')
  const [isRecurring, setIsRecurring] = useState(false)

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
    if (isNaN(amountNum) || amountNum < 100) {
      setError('Le montant minimum est de 100 €')
      return false
    }
    if (amountNum > 100000) {
      setError('Le montant maximum est de 100 000 €')
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
    alert(`Versement de ${formatCurrency(parseFloat(amount))} sur ${selectedContract?.label} - POC (non exécuté)`)
    router.push('/app')
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      {/* Back */}
      <Link href="/app" className="inline-flex items-center gap-1 text-sm text-text-muted mb-6">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Retour
      </Link>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s < step ? 'bg-accent text-white' :
              s === step ? 'bg-primary text-white' :
              'bg-gray-200 text-text-muted'
            }`}>
              {s < step ? '✓' : s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 rounded ${s < step ? 'bg-accent' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Contract */}
      {step === 1 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Choisir un contrat</h2>
          <p className="text-text-muted mb-6">Sur quel contrat souhaitez-vous effectuer un versement ?</p>

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

      {/* Step 2: Amount */}
      {step === 2 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Montant du versement</h2>
          <p className="text-text-muted mb-6">
            Contrat : <strong>{selectedContract?.label}</strong>
          </p>

          <Input
            label="Montant"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            hint="Minimum 100 €, maximum 100 000 €"
            rightIcon={<span className="text-text-muted">€</span>}
          />

          <Select
            label="Mode de paiement"
            options={paymentMethods}
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-4"
          />

          <label className="flex items-center gap-3 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-5 h-5 text-primary rounded"
            />
            <span className="text-sm text-text">Programmer un versement mensuel</span>
          </label>

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
          <p className="text-text-muted mb-6">Vérifiez les informations de votre versement.</p>

          <div className="space-y-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex justify-between">
              <span className="text-text-muted">Contrat</span>
              <span className="font-medium text-text">{selectedContract?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Montant</span>
              <span className="font-bold text-xl text-accent">{formatCurrency(parseFloat(amount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Mode de paiement</span>
              <span className="font-medium text-text">
                {paymentMethods.find((p) => p.value === paymentMethod)?.label}
              </span>
            </div>
            {isRecurring && (
              <div className="flex justify-between">
                <span className="text-text-muted">Fréquence</span>
                <span className="font-medium text-text">Mensuel</span>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
            <p className="font-medium">Information</p>
            <p>Ce versement est une démonstration (POC). Aucune transaction réelle ne sera effectuée.</p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={handleBack} fullWidth>
              Modifier
            </Button>
            <Button onClick={handleSubmit} fullWidth>
              Confirmer le versement
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
