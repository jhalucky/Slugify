import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Slugify — Links that mean something',
  description: 'Shorten, track, and understand every click. Built for developers.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f0f0f',
              color: '#f0f0f0',
              border: '1px solid #2e2e2e',
              fontFamily: 'DM Mono, monospace',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
