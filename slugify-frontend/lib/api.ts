const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const getApiKey = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('slugify_api_key')
}

const headers = () => ({
  'Content-Type': 'application/json',
  'x-api-key': getApiKey() || '',
})

// Auth
export const register = async (email: string, name: string) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  })
  return res.json()
}

export const getMe = async () => {
  const res = await fetch(`${API_URL}/api/auth/me`, { headers: headers() })
  return res.json()
}

// URLs
export const createUrl = async (data: { original: string; customSlug?: string; expiresAt?: string }) => {
  const res = await fetch(`${API_URL}/api/urls`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(data),
  })
  return res.json()
}

export const getUrls = async () => {
  const res = await fetch(`${API_URL}/api/urls`, { headers: headers() })
  return res.json()
}

export const deleteUrl = async (slug: string) => {
  const res = await fetch(`${API_URL}/api/urls/${slug}`, {
    method: 'DELETE',
    headers: headers(),
  })
  return res.json()
}

// Analytics
export const getOverview = async () => {
  const res = await fetch(`${API_URL}/api/analytics/overview`, { headers: headers() })
  return res.json()
}

export const getSlugAnalytics = async (slug: string) => {
  const res = await fetch(`${API_URL}/api/analytics/${slug}`, { headers: headers() })
  return res.json()
}
