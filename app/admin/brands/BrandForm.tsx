'use client'

import { createBrand, updateBrand } from '@/app/actions/brand'
import { UploadButton } from '@/lib/uploadthing'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

type BrandFormProps = {
  brand?: {
    id: string
    name: string
    logoUrl: string | null
  }
}

export default function BrandForm({ brand }: BrandFormProps) {
  const router = useRouter()
  const [name, setName] = useState(brand?.name ?? '')
  const [logoUrl, setLogoUrl] = useState<string | null>(brand?.logoUrl ?? null)
  const [isPending, startTransition] = useTransition()
  const isEditing = Boolean(brand)

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    startTransition(async () => {
      if (brand) {
        await updateBrand(brand.id, { name, logoUrl: logoUrl ?? '' })
        router.push('/admin/brands')
      } else {
        await createBrand({ name, logoUrl: logoUrl ?? undefined })
        setName('')
        setLogoUrl(null)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-sm font-medium">
          Nom de la marque
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded border px-3 py-2"
        ></input>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium">Logo</span>
        {logoUrl ? (
          <div className="flex items-center gap-3">
            <Image
              src={logoUrl}
              alt=""
              width={64}
              height={64}
              className="h-16 w-auto rounded object-contain"
            />
            <button
              type="button"
              onClick={() => setLogoUrl(null)}
              className="rounded bg-purple-500 px-3 py-2 text-sm text-white"
            >
              Changer le logo
            </button>
          </div>
        ) : (
          <UploadButton
            endpoint="brandLogo"
            onClientUploadComplete={(res) => setLogoUrl(res[0]?.ufsUrl ?? null)}
            onUploadError={(error) => alert(`Erreur d'upload : ${error.message}`)}
          />
        )}
      </div>

      <button
        type="submit"
        disabled={isPending || !name}
        className="rounded bg-purple-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? 'Enregistrement ...' : isEditing ? 'Enregistrer' : 'Créer la marque'}
      </button>
    </form>
  )
}
