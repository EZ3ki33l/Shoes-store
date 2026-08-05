'use client'

/**
 * Formulaire création / édition d'une marque (nom + logo via UploadThing).
 */

import { createBrand, updateBrand } from '@/app/actions/brand'
import { Field, FieldGroup, FieldLabel, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
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
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col gap-4 rounded-lg border p-4"
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name">Nom de la marque</FieldLabel>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>
        <Field>
          <FieldTitle>Logo</FieldTitle>
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
                className="bg-primary-500 text-primary-950 rounded px-3 py-2 text-sm"
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
        </Field>
      </FieldGroup>

      <div className="flex w-full justify-center">
        <button
          type="submit"
          disabled={isPending || !name}
          autoComplete="off"
          className="bg-primary-500 text-primary-950 w-1/2 rounded px-4 py-2 disabled:opacity-50"
        >
          {isPending ? 'Enregistrement ...' : isEditing ? 'Enregistrer' : 'Créer la marque'}
        </button>
      </div>
    </form>
  )
}
