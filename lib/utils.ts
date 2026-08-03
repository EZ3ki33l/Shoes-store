export default function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function buildSku(productSlug: string, size: string, color: string) {
  return [productSlug, size, color]
    .map((part) => slugify(part))
    .join('-')
    .toUpperCase()
}
