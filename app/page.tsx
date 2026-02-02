'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'

function LoginForm() {
  const router = useRouter()
  const { login, isLoading, isAuthenticated } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/app')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Veuillez remplir tous les champs')
      return
    }

    try {
      await login({ email, password })
      router.push('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  return (
    <Card className="p-6" variant="glass">
      {/* Logo */}
      <div className="text-center mb-8">
        <Image
          src="/image.webp"
          alt="Club Invest"
          width={180}
          height={50}
          className="mx-auto mb-4"
          priority
        />
        <p className="text-text-muted text-sm">Connectez-vous à votre espace</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Identifiant"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="test"
          autoComplete="username"
        />

        <Input
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="test"
          autoComplete="current-password"
        />

        {error && (
          <div className="p-3 bg-danger/10 border border-danger/20 rounded-xl text-sm text-danger">
            {error}
          </div>
        )}

        <Button type="submit" loading={isLoading} fullWidth variant="gradient">
          Se connecter
        </Button>
      </form>

      <div className="mt-4 text-center">
        <a href="#" className="text-sm text-text-muted hover:text-primary transition-colors">
          Mot de passe oublié ?
        </a>
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
  )
}

function LoginFormSkeleton() {
  return (
    <Card className="p-6" variant="glass">
      <div className="text-center mb-8">
        <div className="h-9 bg-white/10 rounded w-40 mx-auto mb-4 animate-pulse" />
        <div className="h-4 bg-white/10 rounded w-48 mx-auto animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-[70px] bg-white/10 rounded-xl animate-pulse" />
        <div className="h-[70px] bg-white/10 rounded-xl animate-pulse" />
        <div className="h-12 bg-white/10 rounded-xl animate-pulse" />
      </div>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main content */}
      <main className="flex-1 px-4 pt-16 pb-8 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>

          {/* Not a client yet */}
          <div className="mt-8 text-center">
            <p className="text-text-muted text-sm mb-3">Pas encore client ?</p>
            <Link
              href="/simulate"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 text-base font-medium text-text bg-transparent border border-border hover:bg-surface-elevated hover:border-primary rounded-2xl transition-all"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
              </svg>
              Découvrir avec le simulateur
            </Link>
          </div>
        </div>
      </main>

    </div>
  )
}
