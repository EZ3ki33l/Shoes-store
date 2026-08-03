'use client'

import { createProductImage, updateProductImage } from '@/app/actions/productImages'
import { UploadButton } from '@/lib/uploadthing'
import Image from 'next/image'
import { useState, useTransition } from 'react'

type ImageFormProps = {
  productId: string
  variants: { id: string; size: string; color: string }[]
  image?: {
    id: string
    url: string
    alt: string | null
    position: number
    color: string | null
  }
}

export default function ImageForm({ productId, variants, image }: ImageFormProps) {
  const [url, setUrl] = useState<string | null>(image?.url ?? null)
  const [alt, setAlt] = useState(image?.alt ?? '')
  const [position, setPosition] = useState(image ? String(image.position) : '0')
  const [color, setColor] = useState(image?.color ?? '')
  const [isPending, startTransition] = useTransition()
  const isEditing = Boolean(image)

  const uniqueColors = [...new Set(variants.map((v) => v.color))]

  function resetForm() {
    setUrl(null)
    setAlt('')
    setPosition('0')
    setColor('')
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!url) return

    startTransition(async () => {
      const payload = {
        url,
        alt: alt || null,
        position: Number(position),
        color: color || null,
      }

      if (image) {
        await updateProductImage(image.id, payload)
      } else {
        await createProductImage({ productId, ...payload })
        resetForm()
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <span>Image</span>
        {url ? (
          <div className="flex items-center gap-3">
            <Image
              src={url}
              alt=""
              width={64}
              height={64}
              className="h-16 w-auto rounded object-contain"
            />
            <button
              type="button"
              onClick={() => setUrl(null)}
              className="rounded bg-purple-500 px-3 py-2 text-sm text-white"
            >
              Changer l&apos;image
            </button>
          </div>
        ) : (
          <UploadButton
            endpoint="productImages"
            onClientUploadComplete={(res) => setUrl(res[0]?.ufsUrl ?? null)}
            onUploadError={(error) => alert(`Erreur d'upload : ${error.message}`)}
          />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="alt">Texte alternatif</label>
        <input
          id="alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="h-10 w-full rounded border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="position">Position</label>
        <input
          id="position"
          type="number"
          step="1"
          min="0"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="h-10 w-full rounded border px-3 py-2"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="color">Couleur (optionnel)</label>
        <select
          id="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-10 w-full rounded border px-3 py-2"
        >
          <option value="">Toutes les couleurs</option>
          {uniqueColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending || !url}
        className="rounded bg-purple-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Enregistrement ...' : isEditing ? 'Enregistrer' : "Ajouter l'image"}
      </button>
    </form>
  )
}
