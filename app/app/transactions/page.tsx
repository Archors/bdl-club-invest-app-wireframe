'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useTransactions, useContracts } from '@/hooks/useContracts'
import { formatCurrency, formatDate } from '@/domain/utils/formatters'
import { cn } from '@/lib/cn'

export default function OperationsPage() {
  const { contracts } = useContracts()
  const { transactions } = useTransactions()

  const hasAV = contracts.some((c) => c.type === 'assurance-vie')
  const hasPER = contracts.some((c) => c.type === 'per')
  const hasBoth = hasAV && hasPER

  // Filtrer uniquement les versements (programmés et libres)
  const allDeposits = transactions.filter((tx) => tx.type === 'deposit')
  const depositTransactions = allDeposits.slice(0, 4)

  const getContractLabel = (contractId: string) => {
    return contracts.find((c) => c.id === contractId)?.label || contractId
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text">Mes Opérations</h2>
        <p className="text-text-muted text-sm mt-1">Gérez vos investissements</p>
      </div>

      {/* 4 boutons-blocs */}
      <div className="space-y-3">
        {/* 1. Versement libre */}
        <Link href="/app/actions/deposit" className="block">
          <Card className="cursor-pointer hover:border-primary/30 transition-colors border border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent-light shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text">Nouveau versement libre</p>
                <p className="text-[11px] text-text-muted mt-0.5">Versez un montant ponctuel sur votre contrat</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Card>
        </Link>

        {/* 2. Astuce de l'expert - VLP */}
        <Link href="/app/actions/scheduled-deposit" className="block">
          <Card className="cursor-pointer hover:border-accent-light/30 transition-colors border-2 border-accent-light/20 bg-accent-light/5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent-light shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
                  <path d="M8 18h.01" /><path d="M12 18h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-beige flex items-center flex-nowrap"><span className="whitespace-nowrap">Versement programmé</span> <span className="ml-auto"><Badge variant="info" size="sm">Recommandé</Badge></span></p>
                <p className="text-[11px] text-text-muted mt-0.5">Automatisez vos investissements chaque mois</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent-light shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Card>
        </Link>

        {/* 3. Ouvrir un nouveau contrat (conditionnel) */}
        {!hasBoth && (
          <Link href="/app/actions/deposit" className="block">
          <Card className="cursor-pointer hover:border-primary/30 transition-colors border border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-success/15 flex items-center justify-center text-success-light shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="12" y1="11" x2="12" y2="17" />
                  <line x1="9" y1="14" x2="15" y2="14" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text">
                  {hasAV && !hasPER ? 'Ouvrir un PER' : 'Ouvrir une Assurance Vie'}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {hasAV && !hasPER ? (
                    <>
                      <li className="text-xs text-text-muted flex items-start gap-1.5">
                        <span className="text-success mt-0.5">&#10003;</span>
                        Déduction fiscale des versements
                      </li>
                      <li className="text-xs text-text-muted flex items-start gap-1.5">
                        <span className="text-success mt-0.5">&#10003;</span>
                        Préparer sereinement votre retraite
                      </li>
                      <li className="text-xs text-text-muted flex items-start gap-1.5">
                        <span className="text-success mt-0.5">&#10003;</span>
                        Sortie en capital ou en rente
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="text-xs text-text-muted flex items-start gap-1.5">
                        <span className="text-success mt-0.5">&#10003;</span>
                        Un cadre fiscal avantageux
                      </li>
                      <li className="text-xs text-text-muted flex items-start gap-1.5">
                        <span className="text-success mt-0.5">&#10003;</span>
                        Une épargne disponible à tout moment
                      </li>
                      <li className="text-xs text-text-muted flex items-start gap-1.5">
                        <span className="text-success mt-0.5">&#10003;</span>
                        Transmission optimisée du patrimoine
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Card>
          </Link>
        )}

        {/* 4. Contrat enfant mineur */}
        <Link href="/app/actions/deposit" className="block">
          <Card className="cursor-pointer hover:border-primary/30 transition-colors border border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-warning/15 flex items-center justify-center text-warning shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text">Contrat enfant mineur</p>
                <p className="text-[11px] text-text-muted mt-0.5">Préparez l&apos;avenir de votre enfant dès maintenant</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Card>
        </Link>
      </div>

      {/* Derniers mouvements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-text">Derniers mouvements</h3>
          {allDeposits.length > 4 && (
            <Link href="/app/transactions/history" className="text-xs text-accent-light font-medium">
              Voir plus
            </Link>
          )}
        </div>
        {depositTransactions.length > 0 ? (
          <Card padding="none">
            <div className="divide-y divide-border/50">
              {depositTransactions.map((tx) => (
                <div key={tx.id} className="px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center',
                      tx.label.includes('programmé') ? 'bg-accent/10 text-accent-light' : 'bg-accent/10 text-accent-light'
                    )}>
                      {tx.label.includes('programmé') ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="19" x2="12" y2="5" />
                          <polyline points="5 12 12 5 19 12" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">{tx.label}</p>
                      <p className="text-[11px] text-text-muted">{formatDate(tx.date)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">+{formatCurrency(tx.amount)}</p>
                    <Badge
                      variant={tx.status === 'completed' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {tx.status === 'completed' ? 'Exécuté' : 'En cours'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card>
            <p className="text-center text-text-muted py-4">Aucun mouvement</p>
          </Card>
        )}
      </div>
    </div>
  )
}
