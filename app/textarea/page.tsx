"use client"

import { Label, Spacer, Textarea } from "@nattui/react-components"

export default function TextareaPage() {
  return (
    <div className="flex w-full max-w-480 flex-col">
      <Label htmlFor="message">Message</Label>
      <Spacer className="h-4" />
      <Textarea id="message" placeholder="Share what's on your mind" />
    </div>
  )
}
