'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

export default function SignupPage() {
  const router = useRouter()
  const { signup, isLoading } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!firstName || !lastName || !email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    try {
      await signup({ firstName, lastName, email, password })
      router.push('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="px-4 h-14 flex items-center justify-between">
          <Link href="/simulate" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <Image src="/image.webp" alt="Club Invest" width={80} height={22} />
          </Link>
          <h1 className="text-base font-semibold text-text">Inscription</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-4 pt-8 pb-20">
        <div className="w-full max-w-sm mx-auto">
          <Card className="p-6" variant="glass">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-text mb-2">Créer mon compte</h2>
              <p className="text-text-muted text-sm">Rejoignez Club Invest</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Prénom"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jean"
                />
                <Input
                  label="Nom"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Dupont"
                />
              </div>

              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jean@email.com"
              />

              <Input
                label="Mot de passe"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />

              {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger">
                  {error}
                </div>
              )}

              <Button type="submit" loading={isLoading} fullWidth variant="gradient">
                Créer mon compte
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-text-muted hover:text-primary transition-colors">
                Déjà un compte ? Se connecter
              </Link>
            </div>

            {/* Partnership */}
            <div className="mt-6 pt-6 border-t border-border flex flex-col items-center gap-2">
              <p className="text-xs text-text-subtle">En partenariat avec</p>
              <Image
                src="/Z_0r6evxEdbNPBk9_Assicurazioni_Generali_-logo-.svg"
                alt="Generali"
                width={50}
                height={14}
                className="opacity-70"
              />
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
