'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { Modal, ConfirmModal } from '@/components/ui/Modal'
import { useAuth } from '@/hooks/useAuth'
import { formatDate } from '@/domain/utils/formatters'
import type { RiskProfile } from '@/domain/types'

const riskProfiles = [
  {
    value: 'tempere' as RiskProfile,
    name: 'Tempéré',
    risk: '3/7',
    objective: '5%',
    description: 'Croissance régulière avec volatilité maîtrisée',
  },
  {
    value: 'audacieux' as RiskProfile,
    name: 'Audacieux',
    risk: '5/7',
    objective: '8%',
    description: 'Performance maximale avec volatilité plus élevée',
  },
]

export default function ProfilePage() {
  const router = useRouter()
  const { user, updateProfile, logout, isLoading } = useAuth()
  const [editing, setEditing] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [riskProfile, setRiskProfile] = useState<RiskProfile>(user?.riskProfile || 'tempere')
  const [emailNotifications, setEmailNotifications] = useState(user?.emailNotifications ?? true)

  const handleSave = async () => {
    try {
      await updateProfile({
        firstName,
        lastName,
        phone,
        riskProfile,
        emailNotifications,
      })
      setEditing(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!user) return null

  return (
    <div className="p-4 space-y-6">
      {/* Profile Info */}
      <Card>
        <CardHeader
          title="Informations personnelles"
          action={
            !editing ? (
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                Modifier
              </Button>
            ) : null
          }
        />

        <div className="space-y-4">
          {editing ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Prénom"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Nom"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <Input
                label="Email"
                value={user.email}
                disabled
                hint="L'email ne peut pas être modifié"
              />
              <Input
                label="Téléphone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
              />
              <div className="flex gap-3 pt-4">
                <Button variant="secondary" onClick={() => setEditing(false)} fullWidth>
                  Annuler
                </Button>
                <Button onClick={handleSave} loading={isLoading} fullWidth>
                  Enregistrer
                </Button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </Card>

      {/* Risk Profile */}
      <Card>
        <CardHeader title="Profil investisseur" />
        <div className="space-y-3">
          {riskProfiles.map((profile) => {
            const isSelected = riskProfile === profile.value
            return (
              <button
                key={profile.value}
                onClick={() => setRiskProfile(profile.value)}
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
        {riskProfile !== user.riskProfile && (
          <Button
            onClick={() => updateProfile({ riskProfile })}
            loading={isLoading}
            className="mt-4"
            fullWidth
          >
            Mettre à jour le profil
          </Button>
        )}
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader title="Notifications" />
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium text-text">Notifications email</p>
              <p className="text-sm text-text-muted">Recevoir les alertes par email</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => {
                setEmailNotifications(e.target.checked)
                updateProfile({ emailNotifications: e.target.checked })
              }}
              className="w-5 h-5 text-primary rounded"
            />
          </label>
        </div>
      </Card>

      {/* Logout */}
      <Card>
        <Button
          variant="secondary"
          onClick={() => setShowLogoutModal(true)}
          fullWidth
        >
          Se déconnecter
        </Button>
      </Card>

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
