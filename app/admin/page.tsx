import { requireAdmin } from '@/lib/auth'
import Typo from '../components/Typography'

export default async function AdminPage() {
  const admin = await requireAdmin()

  return (
    <div>
      <Typo variant="h1" as="h1">
        Espace admin
      </Typo>
      <Typo variant="body" as="body">
        Connecté en tant que {admin.email}
      </Typo>
    </div>
  )
}
