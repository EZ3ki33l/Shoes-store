'use client'

/**
 * Interrupteur clair / sombre.
 * Bascule la classe `dark` sur <html> et affiche une pastille animée
 * avec des icônes basket adaptées à chaque thème.
 */

import React, { useEffect, useState } from 'react'

function IconLight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="100%" height="100%">
      {/*Semelle*/}
      <rect
        x="15"
        y="90"
        width="170"
        height="15"
        rx="5"
        fill="var(--primary-50)"
        stroke="var(--secondary-900)"
        strokeWidth="4"
      />
      {/*Corps de la basket*/}
      <path
        d="M 20,90 L 20,40 C 40,40 50,20 80,20 L 110,20 C 130,20 140,50 160,50 L 175,50 C 185,50 190,65 190,90 Z"
        fill="var(--primary-50)"
        stroke="var(--secondary-900)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/*Lacets*/}
      <line
        x1="90"
        y1="35"
        x2="110"
        y2="35"
        stroke="var(--secondary-900)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="45"
        x2="120"
        y2="45"
        stroke="var(--secondary-900)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/*Détail*/}
      <path
        d="M 60,50 L 100,70 L 70,80 Z"
        fill="var(--secondary-100)"
        stroke="var(--secondary-900)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconDark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="100%" height="100%">
      {/*Semelle*/}
      <rect
        x="15"
        y="90"
        width="170"
        height="15"
        rx="5"
        fill="var(--secondary-800)"
        stroke="var(--secondary-300)"
        strokeWidth="4"
      />
      {/*Corps de la basket*/}
      <path
        d="M 20,90 L 20,40 C 40,40 50,20 80,20 L 110,20 C 130,20 140,50 160,50 L 175,50 C 185,50 190,65 190,90 Z"
        fill="var(--secondary-950)"
        stroke="var(--secondary-300)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/*Lacets*/}
      <line
        x1="90"
        y1="35"
        x2="110"
        y2="35"
        stroke="var(--primary-50)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="45"
        x2="120"
        y2="45"
        stroke="var(--primary-50)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/*Détail*/}
      <path
        d="M 60,50 L 100,70 L 70,80 Z"
        fill="var(--secondary-900)"
        stroke="var(--secondary-300)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ThemeSwitchExample() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const isDark = theme === 'dark'
  // Applique / retire la classe `dark` sur <html> (utilisée par Tailwind)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Changer le thème"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative flex h-10 w-20 items-center justify-between rounded-full bg-muted p-1 sm:h-12"
    >
      {/* Pastille qui glisse */}
      <span
        aria-hidden
        className={`pointer-events-none absolute top-1 left-1 h-8 w-8 rounded-full bg-card shadow transition-transform duration-300 sm:top-2 ${
          isDark ? 'translate-x-10' : 'translate-x-0'
        }`}
      />
      {/* Icône light (gauche) */}
      <span
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center transition-opacity duration-300 ${
          isDark ? 'opacity-40' : 'opacity-100'
        }`}
      >
        <IconLight />
      </span>
      {/* Icône dark (droite) */}
      <span
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center transition-opacity duration-300 ${
          isDark ? 'opacity-100' : 'opacity-40'
        }`}
      >
        <IconDark />
      </span>
    </button>
  )
}
