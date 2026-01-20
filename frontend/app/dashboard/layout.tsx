// @ts-nocheck
import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main
        id="main-content"
        className="flex-1 overflow-y-auto bg-background"
      >
        <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8 pt-3 sm:pt-4">
          {children}
        </div>
      </main>
    </div>
  )
}
