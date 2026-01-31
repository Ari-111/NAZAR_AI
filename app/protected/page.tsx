import ProtectedPageClient from "./ProtectedPageClient"

// Prevent static prerendering - this page requires runtime Supabase credentials
export const dynamic = 'force-dynamic'

export default function ProtectedPage() {
  return <ProtectedPageClient />
}

