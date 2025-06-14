"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/stores/auth-store"

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return <>{children}</>
}
