import type { Metadata } from "next"
import "@/styles/global.css"

export const metadata: Metadata = {
  title: "Home",
  description:
    "Welcome to the Cloudflare Dev Platform - Powering the next generation of applications",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


