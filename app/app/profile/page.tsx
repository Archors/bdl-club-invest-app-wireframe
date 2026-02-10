'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ConfirmModal } from '@/components/ui/Modal'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useContracts } from '@/hooks/useContracts'
import { formatDate } from '@/domain/utils/formatters'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { contracts } = useContracts()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="p-4 space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader title="Informations personnelles" />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-muted">Prénom</p>
              <p className="font-medium text-text">{user.firstName}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Nom</p>
              <p className="font-medium text-text">{user.lastName}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-text-muted">Email</p>
            <p className="font-medium text-text">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Téléphone</p>
            <p className="font-medium text-text">{user.phone || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-text-muted">Membre depuis</p>
            <p className="font-medium text-text">{formatDate(user.createdAt)}</p>
          </div>
        </div>
      </Card>

      {/* Mes contrats */}
      <div>
        <Link href="/app/contracts">
          <Card className="cursor-pointer hover:border-primary/30 transition-colors border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center text-accent-light shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text">Mes contrats</p>
                  <p className="text-[11px] text-text-muted">{contracts.length} contrat{contracts.length > 1 ? 's' : ''} actif{contracts.length > 1 ? 's' : ''}</p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted shrink-0">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </Card>
        </Link>
      </div>

      {/* Logout */}
      <div>
        <Button
          variant="danger"
          onClick={() => setShowLogoutModal(true)}
          fullWidth
        >
          Se déconnecter
        </Button>
      </div>

      {/* Logout Confirmation */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Se déconnecter"
        message="Êtes-vous sûr de vouloir vous déconnecter ?"
        confirmLabel="Déconnexion"
        cancelLabel="Annuler"
        variant="warning"
      />
    </div>
  )
}
