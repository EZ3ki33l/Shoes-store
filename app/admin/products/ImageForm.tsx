'use client'

/**
 * Gestion des images produit : galerie existante, upload multiple UploadThing,
 * association optionnelle à une couleur de variante.
 */

import {
  createProductImage,
  deleteProductImages,
  updateProductImage,
} from '@/app/actions/productImages'
import IconButton from '@/app/components/IconButton'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UploadButton } from '@/lib/uploadthing'
import { Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useTransition } from 'react'

type ProductImageItem = {
  id: string
  url: string
  alt: string | null
  position: number
  color: string | null
}

type ImageFormProps = {
  productId: string
  variants: { id: string; size: string; color: string }[]
  images?: ProductImageItem[]
  image?: ProductImageItem
}

export default function ImageForm({ productId, variants, images = [], image }: ImageFormProps) {
  const [urls, setUrls] = useState<string[]>(image?.url ? [image.url] : [])
  const [alt, setAlt] = useState(image?.alt ?? '')
  const [position, setPosition] = useState(image ? String(image.position) : '0')
  const [color, setColor] = useState(image?.color ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const isEditing = Boolean(image)

  // Couleurs distinctes issues des variantes (pour lier une image à une couleur)
  const uniqueColors = [...new Set(variants.map((v) => v.color))]

  function resetForm() {
    setUrls([])
    setAlt('')
    setPosition('0')
    setColor('')
    setError(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (urls.length === 0) return

    startTransition(async () => {
      try {
        setError(null)
        const basePosition = Number(position) || 0

        if (image) {
          // Mode édition : une seule image à la fois
          await updateProductImage(image.id, {
            url: urls[0],
            alt: alt || null,
            position: basePosition,
            color: color || null,
          })
        } else {
          // Mode création : positions incrémentées à partir de la position de départ
          await Promise.all(
            urls.map((url, index) =>
              createProductImage({
                productId,
                url,
                alt: alt || null,
                position: basePosition + index,
                color: color || null,
              }),
            ),
          )
          resetForm()
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de l’enregistrement')
      }
    })
  }

  function handleDelete(id: string) {
    if (!confirm('Supprimer cette image ?')) return
    startTransition(async () => {
      try {
        setError(null)
        await deleteProductImages(id)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {!isEditing && images.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Images existantes ({images.length})</h2>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img) => (
              <li key={img.id} className="group bg-muted relative overflow-hidden rounded border">
                <Image
                  src={img.url}
                  alt={img.alt ?? ''}
                  width={240}
                  height={240}
                  className="h-36 w-full object-contain"
                />
                <div className="text-muted-foreground flex items-center justify-between gap-1 border-t px-2 py-1 text-xs">
                  <span className="truncate">{img.color ?? 'Toutes'}</span>
                  <span>#{img.position}</span>
                </div>
                <div className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <IconButton
                    icon={<Trash2 size={14} />}
                    label="Supprimer l’image"
                    variant="danger"
                    onClick={() => handleDelete(img.id)}
                    disabled={isPending}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex flex-col gap-4 rounded-lg border p-4"
      >
        <h2 className="text-lg font-semibold">
          {isEditing ? 'Modifier l’image' : 'Ajouter des images'}
        </h2>

        <FieldGroup>
          <Field>
            <FieldTitle>Images</FieldTitle>
            {urls.length > 0 ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {urls.map((url) => (
                    <div key={url} className="bg-muted relative overflow-hidden rounded border">
                      <Image
                        src={url}
                        alt=""
                        width={80}
                        height={80}
                        className="h-20 w-20 object-contain"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setUrls([])}
                  className="w-fit rounded border px-3 py-2 text-sm"
                >
                  Changer les images
                </button>
              </div>
            ) : (
              <UploadButton
                endpoint="productImages"
                onClientUploadComplete={(res) => {
                  const uploaded = res.map((file) => file.ufsUrl).filter(Boolean)
                  setUrls(isEditing ? uploaded.slice(0, 1) : uploaded)
                }}
                onUploadError={(err) => alert(`Erreur d'upload : ${err.message}`)}
              />
            )}
            {!isEditing && (
              <FieldDescription>Jusqu’à 8 photos à la fois.</FieldDescription>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="alt">Texte alternatif</FieldLabel>
            <Input id="alt" value={alt} onChange={(e) => setAlt(e.target.value)} />
          </Field>

          <Field>
            <FieldLabel htmlFor="position">Position de départ</FieldLabel>
            <Input
              id="position"
              type="number"
              step="1"
              min="0"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="color">Couleur (optionnel)</FieldLabel>
            <Select
              items={[
                { label: 'Toutes les couleurs', value: '' },
                ...uniqueColors.map((c) => ({ label: c, value: c })),
              ]}
              value={color}
              onValueChange={(value) => setColor(value ?? '')}
            >
              <SelectTrigger id="color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les couleurs</SelectItem>
                {uniqueColors.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          {error && <FieldError>{error}</FieldError>}
        </FieldGroup>

        <div className="flex w-full justify-center">
          <button
            type="submit"
            disabled={isPending || urls.length === 0}
            autoComplete="off"
            className="bg-primary-500 text-primary-950 w-1/2 rounded px-4 py-2 disabled:opacity-50"
          >
            {isPending
              ? 'Enregistrement ...'
              : isEditing
                ? 'Enregistrer'
                : urls.length > 1
                  ? `Ajouter ${urls.length} images`
                  : "Ajouter l'image"}
          </button>
        </div>
      </form>
    </div>
  )
}
