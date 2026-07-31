'use client'

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
        fill="#FFFFFF"
        stroke="#1F2937"
        strokeWidth="4"
      />
      {/*Corps de la basket*/}
      <path
        d="M 20,90 L 20,40 C 40,40 50,20 80,20 L 110,20 C 130,20 140,50 160,50 L 175,50 C 185,50 190,65 190,90 Z"
        fill="#FFFFFF"
        stroke="#1F2937"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/*Lacets*/}
      <line
        x1="90"
        y1="35"
        x2="110"
        y2="35"
        stroke="#1F2937"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="45"
        x2="120"
        y2="45"
        stroke="#1F2937"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/*Détail*/}
      <path
        d="M 60,50 L 100,70 L 70,80 Z"
        fill="#F3F4F6"
        stroke="#1F2937"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconDark() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 120" width="100%" height="100%">
      {/*Semelle (Grise pour contraster sur fond sombre)*/}
      <rect
        x="15"
        y="90"
        width="170"
        height="15"
        rx="5"
        fill="#374151"
        stroke="#9CA3AF"
        strokeWidth="4"
      />
      {/*Corps de la basket*/}
      <path
        d="M 20,90 L 20,40 C 40,40 50,20 80,20 L 110,20 C 130,20 140,50 160,50 L 175,50 C 185,50 190,65 190,90 Z"
        fill="#111827"
        stroke="#9CA3AF"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/*Lacets (Blancs pour le contraste) */}
      <line
        x1="90"
        y1="35"
        x2="110"
        y2="35"
        stroke="#F9FAFB"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="100"
        y1="45"
        x2="120"
        y2="45"
        stroke="#F9FAFB"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/*Détail*/}
      <path
        d="M 60,50 L 100,70 L 70,80 Z"
        fill="#1F2937"
        stroke="#9CA3AF"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ThemeSwitchExample() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const isDark = theme === 'dark'
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
      className="relative flex h-10 w-20 items-center justify-between rounded-full bg-neutral-200 p-1 sm:h-12 dark:bg-neutral-700"
    >
      {/* Pastille qui glisse */}
      <span
        aria-hidden
        className={`pointer-events-none absolute top-1 left-1 h-8 w-8 rounded-full bg-neutral-100 shadow transition-transform duration-300 sm:top-2 dark:bg-white ${
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
