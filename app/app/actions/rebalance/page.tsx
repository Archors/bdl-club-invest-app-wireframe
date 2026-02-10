'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useContracts, useContract } from '@/hooks/useContracts'
import { formatCurrency, formatPercent } from '@/domain/utils/formatters'

type Step = 1 | 2 | 3

export default function RebalancePage() {
  const router = useRouter()
  const { contracts } = useContracts()
  const [step, setStep] = useState<Step>(1)

  const [contractId, setContractId] = useState('')
  const [sourcePositionId, setSourcePositionId] = useState('')
  const [targetPositionId, setTargetPositionId] = useState('')
  const [amount, setAmount] = useState('')

  const [error, setError] = useState('')

  const { positions } = useContract(contractId)

  const contractOptions = contracts.map((c) => ({
    value: c.id,
    label: c.label,
  }))

  const positionOptions = positions.map((p) => ({
    value: p.id,
    label: `${p.label} (${formatCurrency(p.totalValue)})`,
  }))

  const sourcePosition = positions.find((p) => p.id === sourcePositionId)
  const targetPosition = positions.find((p) => p.id === targetPositionId)

  const validateStep1 = () => {
    if (!contractId || !sourcePositionId) {
      setError('Veuillez sélectionner un contrat et une position source')
      return false
    }
    setError('')
    return true
  }

  const validateStep2 = () => {
    if (!targetPositionId) {
      setError('Veuillez sélectionner une position cible')
      return false
    }
    if (targetPositionId === sourcePositionId) {
      setError('La position cible doit être différente de la source')
      return false
    }
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum < 100) {
      setError('Le montant minimum est de 100 €')
      return false
    }
    if (sourcePosition && amountNum > sourcePosition.totalValue) {
      setError('Le montant dépasse la valeur de la position source')
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
    alert(`Arbitrage de ${formatCurrency(parseFloat(amount))} de ${sourcePosition?.label} vers ${targetPosition?.label} - POC (non exécuté)`)
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

      {/* Step 1: Source */}
      {step === 1 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Position source</h2>
          <p className="text-text-muted mb-6">Depuis quel support souhaitez-vous arbitrer ?</p>

          <Select
            label="Contrat"
            options={contractOptions}
            value={contractId}
            onChange={(e) => {
              setContractId(e.target.value)
              setSourcePositionId('')
              setTargetPositionId('')
            }}
            placeholder="Sélectionner un contrat"
          />

          {contractId && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-text">Position à désinvestir</p>
              {positions.map((position) => (
                <button
                  key={position.id}
                  onClick={() => setSourcePositionId(position.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-colors ${
                    sourcePositionId === position.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-text">{position.label}</p>
                      <p className="text-xs text-text-muted">{position.isin}</p>
                    </div>
                    <Badge>{position.assetClass}</Badge>
                  </div>
                  <p className="text-lg font-semibold text-text mt-2">{formatCurrency(position.totalValue)}</p>
                </button>
              ))}
            </div>
          )}

          {error && <p className="text-danger text-sm mt-2">{error}</p>}

          <Button onClick={handleNext} fullWidth className="mt-6" disabled={!sourcePositionId}>
            Continuer
          </Button>
        </Card>
      )}

      {/* Step 2: Target */}
      {step === 2 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Position cible</h2>
          <p className="text-text-muted mb-6">
            Depuis : <strong>{sourcePosition?.label}</strong>
          </p>

          <Input
            label="Montant à arbitrer"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            hint={`Maximum : ${sourcePosition ? formatCurrency(sourcePosition.totalValue) : '-'}`}
            rightIcon={<span className="text-text-muted">€</span>}
          />

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-text">Position cible</p>
            {positions
              .filter((p) => p.id !== sourcePositionId)
              .map((position) => (
                <button
                  key={position.id}
                  onClick={() => setTargetPositionId(position.id)}
                  className={`w-full p-3 rounded-xl border text-left transition-colors ${
                    targetPositionId === position.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-text">{position.label}</p>
                      <p className="text-xs text-text-muted">{position.isin}</p>
                    </div>
                    <Badge>{position.assetClass}</Badge>
                  </div>
                </button>
              ))}
          </div>

          {error && <p className="text-danger text-sm mt-2">{error}</p>}

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={handleBack} fullWidth>
              Retour
            </Button>
            <Button onClick={handleNext} fullWidth disabled={!targetPositionId}>
              Continuer
            </Button>
          </div>
        </Card>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <Card>
          <h2 className="text-xl font-bold text-text mb-2">Confirmation</h2>
          <p className="text-text-muted mb-6">Vérifiez les informations de votre arbitrage.</p>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-xs text-text-muted mb-1">Désinvestir</p>
              <p className="font-medium text-text">{sourcePosition?.label}</p>
              <p className="text-danger font-bold">- {formatCurrency(parseFloat(amount))}</p>
            </div>

            <div className="flex justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>

            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-xs text-text-muted mb-1">Investir</p>
              <p className="font-medium text-text">{targetPosition?.label}</p>
              <p className="text-accent font-bold">+ {formatCurrency(parseFloat(amount))}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
            <p className="font-medium">Information</p>
            <p>Cet arbitrage est une démonstration (POC). Aucune transaction réelle ne sera effectuée.</p>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="secondary" onClick={handleBack} fullWidth>
              Modifier
            </Button>
            <Button onClick={handleSubmit} fullWidth>
              Confirmer l&apos;arbitrage
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
