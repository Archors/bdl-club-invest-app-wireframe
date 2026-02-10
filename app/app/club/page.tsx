'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/hooks/useAuth'
import { mockWebinars } from '@/data/webinars'


function CardFace({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
      style={{
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 8px 20px rgba(46,23,208,0.2), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.3)',
      }}
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent/80 to-primary-dark" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10" />

      {/* Silk texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url("/bg-silk.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        mixBlendMode: 'soft-light',
      }} />

      {/* Shine effect */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 70%)',
      }} />

      {/* Gold border line */}
      <div className="absolute inset-[1px] rounded-2xl border border-beige/20" />

      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute top-6 right-6 w-28 h-28 rounded-full border-[1.5px] border-beige" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border-[1.5px] border-beige" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-40 h-40 rounded-full border-[0.5px] border-beige" />
      </div>

      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {children}
      </div>
    </div>
  )
}

function FlippableCard({ firstName, lastName, sponsorCode, flipped, onFlip }: {
  firstName: string
  lastName: string
  sponsorCode: string
  flipped: boolean
  onFlip: () => void
}) {
  return (
    <div
      className="relative w-full aspect-[1.6/1] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={onFlip}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Recto */}
        <CardFace>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-beige/70 text-[10px] uppercase tracking-[0.2em] font-display">BDL Club Invest</p>
              <p className="text-beige-light text-xs mt-0.5 font-display italic">Carte Membre</p>
            </div>
            <div className="w-9 h-9 rounded-full border border-beige/30 bg-white/5 backdrop-blur-sm flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-beige">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-white text-xl font-bold tracking-wide">{firstName} {lastName}</p>
            <div className="mt-3 flex items-center gap-2">
              <p className="text-beige/60 text-[9px] uppercase tracking-[0.15em]">Code parrain</p>
              <p className="text-beige-light text-sm font-mono font-bold bg-white/8 backdrop-blur-sm px-3 py-1 rounded-lg border border-beige/15">{sponsorCode}</p>
            </div>
          </div>
        </CardFace>

        {/* Verso */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
        <CardFace>
          <div className="h-full flex flex-col justify-between">
            <div className="text-center flex-1 flex flex-col items-center justify-center">
              <p className="text-beige/60 text-[10px] uppercase tracking-[0.2em] mb-3 font-display">Code Parrain</p>
              <div className="bg-white/8 backdrop-blur-sm border border-beige/20 rounded-xl px-6 py-3">
                <p className="text-beige-light text-2xl font-mono font-bold tracking-[0.15em]">{sponsorCode}</p>
              </div>
              <p className="text-white/40 text-xs mt-4">Partagez ce code avec vos proches</p>
            </div>
            <div className="text-center">
              <p className="text-beige/30 text-[9px] font-display italic">BDL Club Invest &middot; Membre depuis 2023</p>
            </div>
          </div>
        </CardFace>
        </div>
      </div>
    </div>
  )
}

export default function ClubPage() {
  const { user } = useAuth()
  const [flipped, setFlipped] = useState(false)
  const [showConditions, setShowConditions] = useState(false)
  const [registeredWebinars, setRegisteredWebinars] = useState<string[]>([])

  const firstName = user?.firstName || 'Membre'
  const lastName = user?.lastName || ''
  const sponsorCode = user?.sponsorCode || 'XXXX-XXX-0000'

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BDL Club Invest - Code Parrain',
          text: `Rejoignez BDL Club Invest avec mon code parrain : ${sponsorCode}`,
        })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(sponsorCode)
      alert('Code copié dans le presse-papier !')
    }
  }

  const toggleWebinar = (id: string) => {
    setRegisteredWebinars((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    )
  }

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-text">Le Club</h2>

      {/* Carte membre flippable */}
      <FlippableCard
        firstName={firstName}
        lastName={lastName}
        sponsorCode={sponsorCode}
        flipped={flipped}
        onFlip={() => setFlipped((f) => !f)}
      />
      <p className="text-center text-xs text-text-muted -mt-3">Touchez la carte pour la retourner</p>

      {/* Bouton partager */}
      <button
        onClick={handleShare}
        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-beige/25 bg-beige/8 text-beige-light text-sm font-semibold hover:bg-beige/15 active:bg-beige/20 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        Partager mon code parrain
      </button>

      {/* Parrainage */}
      <Card>
        <div className="space-y-4">
          <h3 className="font-bold text-text">Parrainage</h3>
          <p className="text-sm text-text-muted">Frais de gestion BDL Club Invest offerts pour le parrain <span className="text-beige-light font-semibold">(0,7&nbsp;%&nbsp;/&nbsp;an)</span></p>

          <div className="space-y-2">
            {[
              { filleuls: '1 filleul', reward: '3 mois' },
              { filleuls: '2 filleuls', reward: '6 mois' },
              { filleuls: '3 filleuls', reward: '9 mois' },
              { filleuls: '4–9 filleuls', reward: '1 an' },
              { filleuls: '10 filleuls ou +', reward: 'À VIE', highlight: true },
            ].map((tier) => (
              <div key={tier.filleuls} className={`flex items-center justify-between px-4 py-2.5 rounded-xl ${tier.highlight ? 'bg-beige/10 border border-beige/20' : 'bg-white/5'}`}>
                <span className="text-sm text-text">{tier.filleuls}</span>
                <span className={`text-sm font-bold ${tier.highlight ? 'text-beige-light' : 'text-success'}`}>{tier.reward}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-text-muted">* Sous conditions</p>
        </div>
      </Card>

      {/* Bouton conditions */}
      <button
        onClick={() => setShowConditions(true)}
        className="w-full text-center text-sm text-text-muted underline underline-offset-4 hover:text-primary transition-colors"
      >
        Nos conditions
      </button>

      {/* Webinaires à venir */}
      <div>
        <h3 className="font-bold text-text mb-3">Webinaires à venir</h3>
        <div className="space-y-3">
          {mockWebinars.map((webinar) => {
            const isRegistered = registeredWebinars.includes(webinar.id)
            const date = new Date(webinar.date)
            const formattedDate = date.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })

            return (
              <Card key={webinar.id} className="border border-border">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text">{webinar.title}</p>
                      <p className="text-xs text-text-muted mt-1">{webinar.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {webinar.time}
                    </span>
                    <span>{webinar.speaker}</span>
                  </div>
                  <Button
                    onClick={() => toggleWebinar(webinar.id)}
                    variant={isRegistered ? 'secondary' : 'primary'}
                    size="sm"
                    fullWidth
                  >
                    {isRegistered ? 'Inscrit ✓' : "S'inscrire"}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Modal conditions */}
      <Modal isOpen={showConditions} onClose={() => setShowConditions(false)} title="Conditions du programme de parrainage">
        <div className="space-y-4 text-sm text-text-muted">
          <p>
            Le programme de parrainage BDL Club Invest est soumis aux conditions suivantes :
          </p>
          <ul className="space-y-2 list-disc pl-4">
            <li>Le parrain doit être titulaire d&apos;un contrat actif chez BDL Club Invest.</li>
            <li>Le filleul doit souscrire un contrat d&apos;assurance vie ou un PER avec un versement initial minimum de 5 000 €.</li>
            <li>Le code parrain doit être renseigné lors de la souscription en ligne.</li>
            <li>La réduction des frais de gestion s&apos;applique à partir de la fin de la période promotionnelle en cours.</li>
            <li>Le nombre de filleuls n&apos;est pas limité.</li>
            <li>BDL Club Invest se réserve le droit de modifier les conditions du programme à tout moment.</li>
          </ul>
          <p className="text-xs text-text-subtle">
            Pour toute question, contactez votre conseiller ou écrivez à contact@bdlclubinvest.fr
          </p>
          <Button onClick={() => setShowConditions(false)} fullWidth variant="secondary">
            Fermer
          </Button>
        </div>
      </Modal>
    </div>
  )
}
