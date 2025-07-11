import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'SwingHigh Store - Custom Products',
  description: 'Discover unique custom products created with love and quality materials.',
  keywords: 'custom products, printify, personalized items, unique gifts',
  authors: [{ name: 'SwingHigh Store' }],
  openGraph: {
    title: 'SwingHigh Store - Custom Products',
    description: 'Discover unique custom products created with love and quality materials.',
    type: 'website',
    images: ['/swinghighplain.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SwingHigh Store - Custom Products',
    description: 'Discover unique custom products created with love and quality materials.',
    images: ['/swinghighplain.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </body>
    </html>
  )
} 