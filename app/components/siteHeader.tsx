import { getNavData } from '@/components/getNavData'
import ClientNav from './ClientNav'

export default async function SiteHeader() {
  const nav = await getNavData()

  return <ClientNav {...nav} />
}
