import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FoodGuard — Digital Food Inspection & Safety Verification',
  description: 'FoodGuard digitizes food safety inspections through product verification, bill validation, expiry detection, and transparent inspection records.',
  keywords: 'food safety, inspection, FSSAI, digital inspection, expiry verification',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
