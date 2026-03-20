import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'

export const metadata: Metadata = {
  title: 'KiroTools — Facebook Tools',
  description: 'Fast, free Facebook tools — check live UIDs, find Facebook IDs, extract post IDs, and more.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className="min-h-screen bg-zinc-100 antialiased">
        <Providers>
          <Navbar />
          <div className="pt-[102px] min-h-screen">
            {children}
          </div>
          <Toaster position="bottom-center" richColors />
        </Providers>
      </body>
    </html>
  )
}
