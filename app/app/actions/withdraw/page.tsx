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
import { isValidIBAN } from '@/domain/utils/validators'

type Step = 1 | 2 | 3 | 4
type WithdrawType = 'partial' | 'total'

export default function WithdrawPage() {
  const router = useRouter()
  const { contracts } = useContracts()
  const [step, setStep] = useState<Step>(1)

  const [contractId, setContractId] = useState('')
  const [withdrawType, setWithdrawType] = useState<WithdrawType>('partial')
  const [amount, setAmount] = useState('')
  const [iban, setIban] = useState('')
  const [bic, setBic] = useState('')

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
    if (withdrawType === 'partial') {
      const amountNum = parseFloat(amount)
      if (isNaN(amountNum) || amountNum < 100) {
        setError('Le montant minimum est de 100 €')
        return false
      }
      if (selectedContract && amountNum > selectedContract.currentValue) {
        setError('Le montant dépasse la valeur du contrat')
        return false
      }
    }
    setError('')
    return true
  }

  const validateStep3 = () => {
    if (!iban.trim()) {
      setError('Veuillez renseigner votre IBAN')
      return false
    }
    if (!isValidIBAN(iban)) {
      setError('IBAN invalide')
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
    } else if (step === 3 && validateStep3()) {
      setStep(4)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as Step)
      setError('')
    }
  }

  const handleSubmit = () => {
    const withdrawAmount = withdrawType === 'total' ? selectedContract?.currentValue : parseFloat(amount)
    alert(`Rachat de ${formatCurrency(withdrawAmount || 0)} - POC (non exécuté)`)
    router.push('/app')
  }

  const withdrawAmount = withdrawType === 'total' ? selectedContract?.currentValue : parseFloat(amount)

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
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              s < step ? 'bg-accent text-white' :
              s === step ? 'bg-primary text-white' :
              'bg-white/10 text-text-muted'
            }`}>
              {s < step ? '✓' : s}
            </div>
            {s < 4 && (
              <div className={`flex-1 h-1 mx-2 rounded ${s < step ? 'bg-accent' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Contract */}
      {step === 1 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Choisir un contrat</h2>
          <p className="text-text-muted mb-6">Sur quel contrat souhaitez-vous effectuer un rachat ?</p>

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

      {/* Step 2: Type & Amount */}
      {step === 2 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Type de rachat</h2>
          <p className="text-text-muted mb-6">
            Contrat : <strong className="text-text">{selectedContract?.label}</strong>
            <br />
            Valeur : <strong className="text-text">{selectedContract && formatCurrency(selectedContract.currentValue)}</strong>
          </p>

          <div className="space-y-3 mb-6">
            <button
              onClick={() => setWithdrawType('partial')}
              className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                withdrawType === 'partial'
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-surface-solid hover:border-text-muted'
              }`}
            >
              <p className="font-medium text-text">Rachat partiel</p>
              <p className="text-sm text-text-muted">Retirer une partie de votre épargne</p>
            </button>
            <button
              onClick={() => setWithdrawType('total')}
              className={`w-full p-4 rounded-xl border-2 text-left transition-colors ${
                withdrawType === 'total'
                  ? 'border-danger bg-danger/10'
                  : 'border-border bg-surface-solid hover:border-text-muted'
              }`}
            >
              <p className="font-medium text-text">Rachat total</p>
              <p className="text-sm text-text-muted">Clôturer le contrat et retirer la totalité</p>
            </button>
          </div>

          {withdrawType === 'partial' && (
            <Input
              label="Montant à racheter"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              hint={`Maximum : ${selectedContract ? formatCurrency(selectedContract.currentValue) : '-'}`}
              rightIcon={<span className="text-text-muted">€</span>}
            />
          )}

          {withdrawType === 'total' && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl text-sm text-warning">
              <p className="font-medium">Attention</p>
              <p>Un rachat total entraîne la clôture définitive de votre contrat.</p>
            </div>
          )}

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

      {/* Step 3: Bank Details */}
      {step === 3 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Coordonnées bancaires</h2>
          <p className="text-text-muted mb-6">Compte sur lequel les fonds seront versés.</p>

          <div className="space-y-4">
            <Input
              label="IBAN"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              placeholder="FR76 1234 5678 9012 3456 7890 123"
            />
            <Input
              label="BIC (optionnel)"
              value={bic}
              onChange={(e) => setBic(e.target.value)}
              placeholder="BNPAFRPP"
            />
          </div>

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

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Confirmation</h2>
          <p className="text-text-muted mb-6">Vérifiez les informations de votre rachat.</p>

          <div className="space-y-4 p-4 bg-surface-elevated rounded-xl">
            <div className="flex justify-between">
              <span className="text-text-muted">Contrat</span>
              <span className="font-medium text-text">{selectedContract?.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Type</span>
              <span className="font-medium text-text">
                {withdrawType === 'partial' ? 'Rachat partiel' : 'Rachat total'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Montant</span>
              <span className="font-bold text-xl text-warning">
                {withdrawAmount && formatCurrency(withdrawAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">IBAN</span>
              <span className="font-medium text-text">{iban.slice(0, 10)}...{iban.slice(-4)}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-sm text-primary-light">
            <p className="font-medium">Information</p>
            <p>Ce rachat est une démonstration (POC). Aucune transaction réelle ne sera effectuée.</p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={handleBack} fullWidth>
              Modifier
            </Button>
            <Button onClick={handleSubmit} fullWidth>
              Confirmer le rachat
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
