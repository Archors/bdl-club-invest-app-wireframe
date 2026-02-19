'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ConfirmModal } from '@/components/ui/Modal'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/cn'

const riskLabels: Record<string, { label: string; color: string; bg: string }> = {
  tempere:   { label: 'Tempéré',   color: 'text-accent',  bg: 'bg-accent/10' },
  audacieux: { label: 'Audacieux', color: 'text-warning',  bg: 'bg-warning/10' },
}

function ToggleRow({
  icon,
  label,
  sub,
  enabled,
  onToggle,
  last,
}: {
  icon: React.ReactNode
  label: string
  sub?: string
  enabled: boolean
  onToggle: () => void
  last?: boolean
}) {
  return (
    <button
      onClick={onToggle}
      className={cn('w-full flex items-center gap-3.5 px-4 py-3.5 active:bg-black/5 transition-colors', !last && 'border-b border-border')}
    >
      <div className="w-8 h-8 rounded-xl bg-surface-solid flex items-center justify-center shrink-0 text-text-muted">
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-sm font-medium text-text">{label}</p>
        {sub && <p className="text-[11px] text-text-muted">{sub}</p>}
      </div>
      <div
        className={cn(
          'w-11 h-6 rounded-full transition-colors duration-200 shrink-0 relative',
          enabled ? 'bg-primary' : 'bg-border'
        )}
      >
        <div
          className={cn(
            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </div>
    </button>
  )
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={cn('flex flex-col px-4 py-3.5 gap-0.5', !last && 'border-b border-border')}>
      <p className="text-[11px] text-text-muted">{label}</p>
      <p className="text-sm font-medium text-text">{value}</p>
    </div>
  )
}

function LinkRow({
  icon,
  label,
  href,
  last,
}: {
  icon: React.ReactNode
  label: string
  href: string
  last?: boolean
}) {
  return (
    <a href={href} className={cn('flex items-center gap-3.5 px-4 py-3.5', !last && 'border-b border-border')}>
      <div className="w-8 h-8 rounded-xl bg-surface-solid flex items-center justify-center shrink-0 text-text-muted">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium text-text">{label}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-border shrink-0">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </a>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [biometrics, setBiometrics] = useState(user?.biometrics ?? false)
  const [pushNotifs, setPushNotifs] = useState(user?.pushNotifications ?? false)
  const [emailNotifs, setEmailNotifs] = useState(user?.emailNotifications ?? true)

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!user) return null

  const memberYear = new Date(user.createdAt).getFullYear()
  const risk = riskLabels[user.riskProfile] ?? { label: user.riskProfile, color: 'text-text', bg: 'bg-surface-solid' }
  const address = [user.address, [user.postalCode, user.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')

  return (
    <div className="p-4 space-y-5">

      {/* Coordonnées */}
      <div>
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2 px-1">Coordonnées</p>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Téléphone" value={user.phone || '—'} />
          <InfoRow label="Adresse" value={address || '—'} last />
        </div>
      </div>

      {/* Documents & compte */}
      <div>
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2 px-1">Mon espace</p>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <LinkRow
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13,2 13,9 20,9"/></svg>}
            label="Documents"
            href="/app/documents"
            last
          />
        </div>
      </div>

      {/* Préférences */}
      <div>
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2 px-1">Préférences</p>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <ToggleRow
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>}
            label="Biométrie"
            sub="Empreinte digitale"
            enabled={biometrics}
            onToggle={() => setBiometrics((v) => !v)}
          />
          <ToggleRow
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>}
            label="Notifications push"
            enabled={pushNotifs}
            onToggle={() => setPushNotifs((v) => !v)}
          />
          <ToggleRow
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>}
            label="Emails"
            sub="Relevés et alertes"
            enabled={emailNotifs}
            onToggle={() => setEmailNotifs((v) => !v)}
            last
          />
        </div>
      </div>

      {/* Sécurité */}
      <div>
        <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-2 px-1">Sécurité</p>
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <LinkRow
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
            label="Changer le mot de passe"
            href="/app/profile/password"
            last
          />
        </div>
      </div>

      {/* Déconnexion */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3.5 px-4 py-3.5"
        >
          <div className="w-8 h-8 rounded-xl bg-danger/10 flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-danger">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <span className="flex-1 text-sm font-medium text-danger text-left">Se déconnecter</span>
        </button>
      </div>

      <p className="text-center text-[11px] text-text-subtle pb-2">
        Version {process.env.NEXT_PUBLIC_APP_VERSION ?? '1.0.0'} · Build {process.env.NEXT_PUBLIC_BUILD_NUMBER ?? '1'}
      </p>

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
