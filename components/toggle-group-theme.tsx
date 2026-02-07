"use client"

import { Toggle, ToggleGroup, type ToggleProps } from "@base-ui/react"
import { type LucideIcon, LucideMonitor, LucideMoon, LucideSun } from "@nattui/icons"
import { motion, type ValueAnimationTransition } from "motion/react"
import { useState } from "react"

const THEME = {
  DARK: "dark",
  LIGHT: "light",
  SYSTEM: "system",
}

type Theme = (typeof THEME)[keyof typeof THEME]

interface ToggleThemeProps extends ToggleProps {
  icon: LucideIcon
  isActive: boolean
  label: string
  value: Theme
}

export function ToggleGroupTheme() {
  const [theme, setTheme] = useState<Theme[]>([THEME.LIGHT])

  function onValueChange(value: Theme[]) {
    if (value.length > 0) {
      document.body.classList.remove(...theme)
      document.body.classList.add(...value)
      setTheme(value)
    }
  }

  return (
    <ToggleGroup
      className="rounded-8 bg-gray-3 flex w-fit gap-x-2 overflow-hidden p-2"
      onValueChange={onValueChange}
      value={theme}
    >
      <ToggleTheme
        icon={LucideSun}
        isActive={theme.includes(THEME.LIGHT)}
        label="Light"
        value={THEME.LIGHT}
      />
      <ToggleTheme
        icon={LucideMoon}
        isActive={theme.includes(THEME.DARK)}
        label="Dark"
        value={THEME.DARK}
      />
      <ToggleTheme
        icon={LucideMonitor}
        isActive={theme.includes(THEME.SYSTEM)}
        label="System"
        value={THEME.SYSTEM}
      />
    </ToggleGroup>
  )
}

function ToggleTheme(props: ToggleThemeProps) {
  const { icon: Icon, isActive, label, value, ...rest } = props

  const ICON_SIZE = 16

  const TRANSITION: ValueAnimationTransition = {
    duration: 0.15,
  }

  return (
    <div className="relative isolate flex">
      {/* Highlight */}
      {isActive && (
        <motion.div
          className="bg-gray-1 rounded-6 absolute inset-0"
          layoutId="highlight"
          transition={TRANSITION}
        />
      )}

      <Toggle
        className="rounded-6 focus-visible:outline-primary-9 group z-10 flex h-32 cursor-pointer items-center justify-center gap-x-8 px-10 outline-2 outline-transparent transition-[background-color] select-none"
        value={value}
        {...rest}
      >
        {/* Icon */}
        <Icon
          className="text-gray-11 group-data-pressed:text-primary-9 group-hover:text-gray-12 transition-colors"
          size={ICON_SIZE}
        />

        {/* Label */}
        <span className="text-gray-11 text-14 font-500 group-data-pressed:text-gray-12 group-hover:text-gray-12 transition-colors">
          {label}
        </span>
      </Toggle>
    </div>
  )
}
