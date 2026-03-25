import { createClient } from '@supabase/supabase-js'

type CheckResult = {
  name: string
  ok: boolean
  detail: string
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY
const storageBucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'eop-files'

const checks: CheckResult[] = []

if (!url || !anon) {
  console.error('[HealthCheck] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const anonClient = createClient(url, anon)

const authHealth = await anonClient.auth.getSession()
checks.push({
  name: 'Supabase Auth Reachability',
  ok: !authHealth.error,
  detail: authHealth.error ? authHealth.error.message : 'Auth endpoint reachable',
})

if (serviceRole) {
  const admin = createClient(url, serviceRole)
  const storageHealth = await admin.storage.from(storageBucket).list('', { limit: 1 })
  checks.push({
    name: `Storage Bucket (${storageBucket})`,
    ok: !storageHealth.error,
    detail: storageHealth.error ? storageHealth.error.message : 'Bucket reachable',
  })
} else {
  checks.push({
    name: 'Storage Bucket Check',
    ok: false,
    detail: 'SUPABASE_SERVICE_ROLE_KEY not set; cannot validate storage bucket access',
  })
}

for (const check of checks) {
  const prefix = check.ok ? '✓' : '✗'
  console.log(`${prefix} ${check.name}: ${check.detail}`)
}

const failed = checks.filter((c) => !c.ok)
if (failed.length > 0) {
  console.error(`[HealthCheck] ${failed.length} check(s) failed`)
  process.exit(1)
}

console.log('[HealthCheck] All checks passed')
