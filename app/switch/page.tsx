"use client"

import { Label, Switch } from "@nattui/react-components"

export default function SwitchPage() {
  return (
    <div className="flex flex-col gap-16">
      <Switch />
      <Switch isDefaultChecked />
      <Switch isDisabled />
      <Switch isDefaultChecked isDisabled />

      <Switch isReadOnly />
      <Switch isRequired />

      <Label>Size</Label>
      <div className="flex flex-wrap items-center gap-16">
        <Switch size={14} />
        <Switch size={24} />
      </div>

      <Label className="flex items-center gap-8" htmlFor="switch-with-label">
        Switch with label
        <Switch id="switch-with-label" />
      </Label>
    </div>
  )
}
