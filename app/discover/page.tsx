'use client'

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function DiscoverPage() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F4EFEB" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          borderRadius: "0 0 32px 32px",
        }}
      >
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white shrink-0"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <Image src="/image.webp" alt="Club Invest" width={80} height={22} priority />
          </div>
          <h1 className="font-semibold text-base text-white">Nous connaître</h1>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 space-y-5">

        {/* ── Keypoints (comme sur le site) ── */}
        <div className="rounded-xl p-5 space-y-5" style={{ backgroundColor: "#FFFFFF" }}>
          <h2
            className="text-lg font-light leading-snug"
            style={{ color: "#0B034D", fontFamily: "Trirong" }}
          >
            Avec Club Invest, l&apos;investissement en actions devient <span style={{ color: "#A77958" }}>facile</span>
          </h2>
          <div className="space-y-4">
            {[
              { label: "Digital", text: "Devenez membre en moins de 10 min", pct: "100%" },
              { label: "Flexible*", text: "Récupérez votre argent à tout moment", pct: "100%" },
              { label: "Actions", text: "Le support d'épargne le plus performant historiquement", pct: "100%" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-medium" style={{ color: "#A77958", fontFamily: "Lexend" }}>{item.label}</p>
                  <p className="text-[11px] leading-snug mt-0.5" style={{ color: "#031C4F", fontFamily: "Lexend" }}>{item.text}</p>
                </div>
                <span className="text-xl font-light shrink-0" style={{ color: "#A77958", fontFamily: "Trirong" }}>{item.pct}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Expertise ── */}
        <div
          className="rounded-xl p-5 flex flex-col items-center gap-3"
          style={{
            background: "url('/background.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <span className="text-xs font-medium" style={{ color: "#C3AA9B", fontFamily: "Lexend" }}>
            Expertise
          </span>
          <p className="text-[11px] text-center leading-snug" style={{ color: "#FFFFFF", fontFamily: "Lexend" }}>
            L&apos;exigence des investisseurs professionnels pour votre épargne
          </p>
          <div className="flex gap-8">
            <div className="flex flex-col items-center">
              <span className="text-lg font-light" style={{ color: "#FFFFFF", fontFamily: "Trirong" }}>+250</span>
              <span className="text-[9px]" style={{ color: "#C3AA9B", fontFamily: "Lexend" }}>clients institutionnels</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-lg font-light" style={{ color: "#FFFFFF", fontFamily: "Trirong" }}>3.8 Mds €</span>
              <span className="text-[9px]" style={{ color: "#C3AA9B", fontFamily: "Lexend" }}>sous gestion</span>
            </div>
          </div>
          <button
            onClick={() => setShowVideo(true)}
            className="text-[11px] font-medium"
            style={{ color: "#F4EFEB", textDecoration: "underline", textUnderlineOffset: 3, fontFamily: "Lexend", background: "none", border: "none", cursor: "pointer" }}
          >
            Nous connaître
          </button>
        </div>

        {/* ── Détail des frais ── */}
        <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF" }}>
          <span className="text-[11px] font-medium block mb-3" style={{ color: "#A77958", fontFamily: "Lexend" }}>
            Détail des frais
          </span>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "#0B034D", fontFamily: "Lexend" }}>Frais de versement</span>
              <span className="text-sm font-light" style={{ color: "#A77958", fontFamily: "Trirong" }}>0%</span>
            </div>
            <div className="h-px" style={{ backgroundColor: "#E5E8F2" }} />
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "#0B034D", fontFamily: "Lexend" }}>Frais d&apos;arbitrage</span>
              <span className="text-sm font-light" style={{ color: "#A77958", fontFamily: "Trirong" }}>0%</span>
            </div>
            <div className="h-px" style={{ backgroundColor: "#E5E8F2" }} />
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "#0B034D", fontFamily: "Lexend" }}>Frais de gestion</span>
              <span className="text-sm font-light" style={{ color: "#A77958", fontFamily: "Trirong" }}>0,7%</span>
            </div>
            <div className="h-px" style={{ backgroundColor: "#E5E8F2" }} />
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "#0B034D", fontFamily: "Lexend" }}>Frais assureur (Generali)</span>
              <span className="text-sm font-light" style={{ color: "#A77958", fontFamily: "Trirong" }}>0,5%</span>
            </div>
            <div className="h-px" style={{ backgroundColor: "#E5E8F2" }} />
            <div className="flex items-center justify-between">
              <span className="text-[11px]" style={{ color: "#0B034D", fontFamily: "Lexend" }}>Frais d&apos;entrée ou de sortie</span>
              <span className="text-sm font-light" style={{ color: "#A77958", fontFamily: "Trirong" }}>0%</span>
            </div>
          </div>
          <div className="h-px mt-2" style={{ backgroundColor: "#E5E8F2" }} />
          <div className="mt-2">
            <span className="text-[11px] font-medium" style={{ color: "#A77958", fontFamily: "Lexend" }}>Frais des fonds UC</span>
            <span className="text-[9px] block whitespace-nowrap" style={{ color: "#7C789A", fontFamily: "Lexend" }}>Chaque fonds a ses propres frais internes. Veuillez-vous référer au DIC.</span>
          </div>
        </div>

        {/* Video player modal */}
        {showVideo && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
            onClick={() => setShowVideo(false)}
          >
            <div className="relative w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setShowVideo(false)}
                className="absolute -top-10 right-0 text-white text-sm font-medium flex items-center gap-1"
                style={{ fontFamily: "Lexend" }}
              >
                Fermer
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src="https://www.youtube.com/embed/CJbJ9ni7lZQ?autoplay=1"
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Performance Banner ── */}
        <div
          className="p-5 rounded-xl flex flex-col items-center gap-1"
          style={{ backgroundColor: "#2E17D0" }}
        >
          <span className="text-[11px] font-medium" style={{ color: "#F4EFEB", fontFamily: "Lexend" }}>
            Performance du profil audacieux
          </span>
          <span className="text-3xl font-light" style={{ color: "#FFFFFF", fontFamily: "Trirong" }}>
            +17,37%
          </span>
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "Lexend", textTransform: "uppercase" }}>
            en 2025
          </span>
        </div>
        <p className="text-[8px] leading-relaxed -mt-3 px-1" style={{ color: "#7C789A", fontFamily: "Lexend" }}>
          *Performance du profil audacieux en assurance vie du 31/12/2024 au 31/12/2025. Nette des frais de gestion BDL Club Invest, des frais de gestion administrative du contrat d&apos;assurance‑vie et des frais des supports sous‑jacents, brute de prélèvements sociaux et fiscaux. La performance du 1ᵉʳ janvier au 28 avril 2025 (date de création de BDL Club Invest) correspond à une performance backtestée.
          <br />
          Les performances passées ne préjugent pas des performances futures.
        </p>

        {/* ── CTA ── */}
        <Link
          href="/simulate"
          className="flex items-center justify-center gap-1.5 w-full px-4 py-3 text-[13px] font-medium text-white gradient-cta rounded-2xl transition-all whitespace-nowrap"
          style={{ fontFamily: "Lexend" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12" />
          </svg>
          Simuler mon projet en moins d&apos;une minute
        </Link>

      </main>
    </div>
  );
}
