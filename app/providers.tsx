"use client"

import type { PropsWithChildren } from "react"
import { TooltipProvider } from "@/components/tooltip"

export function Providers(props: PropsWithChildren) {
  const { children } = props

  return <TooltipProvider>{children}</TooltipProvider>
}
