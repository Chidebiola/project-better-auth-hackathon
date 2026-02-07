"use client"

import { Combobox } from "@base-ui/react/combobox"
import { LucideCheck, LucideChevronDown, LucideX } from "@nattui/icons"
import { Label } from "@nattui/react-components"
import { useId } from "react"

interface ColorComboboxProps {
  label?: string
  onChange?: (value: string) => void
  options?: readonly string[]
  placeholder?: string
}

const DEFAULT_OPTIONS = [
  "color-gray-slate",
  "color-primary-blue",
  "color-primary-red",
  "color-primary-green",
] as const

export function ColorCombobox(props: ColorComboboxProps) {
  const {
    label = "Choose a color class",
    placeholder = "e.g. color-primary-red",
    options = DEFAULT_OPTIONS,
    onChange,
  } = props
  const id = useId()

  const handleValueChange = (value: string) => {
    const body = document.body
    const group = options as readonly string[]
    if (!group || group.length === 0) return
    body.classList.remove(...group)
    body.classList.add(value)

    // // Toggle global dark mode when a gray "-dark" theme is selected
    // const isGrayCombobox = group.some((cls) => cls.startsWith("color-gray-"))
    // if (isGrayCombobox) {
    //   if (value.endsWith("-dark")) {
    //     body.classList.add("dark")
    //   } else {
    //     body.classList.remove("dark")
    //   }
    // }

    onChange?.(value)
  }

  return (
    <Combobox.Root items={options} onValueChange={(value) => handleValueChange(value as string)}>
      <div className="font-500 text-14 text-gray-11 relative flex flex-col gap-4">
        <Label htmlFor={id}>{label}</Label>
        <Combobox.Input
          className="border-gray-5 bg-gray-1 text-16 text-gray-11 focus:outline-primary-9 h-40 w-256 rounded-md border pl-14 font-normal focus:outline-2 focus:-outline-offset-1"
          id={id}
          placeholder={placeholder}
        />
        <div className="text-gray-11 absolute right-8 bottom-0 flex h-40 items-center justify-center">
          <Combobox.Clear
            aria-label="Clear selection"
            className="flex h-40 w-24 items-center justify-center rounded bg-transparent p-0"
          >
            <LucideX className="size-4" />
          </Combobox.Clear>
          <Combobox.Trigger
            aria-label="Open popup"
            className="flex h-40 w-24 items-center justify-center rounded bg-transparent p-0"
          >
            <LucideChevronDown className="size-16" />
          </Combobox.Trigger>
        </div>
      </div>

      <Combobox.Portal>
        <Combobox.Positioner className="outline-none" sideOffset={4}>
          <Combobox.Popup className="w-var(--anchor-width) max-w-var(--available-width) bg-gray-1 text-gray-11 shadow-gray-6 outline-gray-6 max-h-[min(var(--available-height),368px)] origin-(--transform-origin) scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain rounded-md py-2 shadow-lg outline-1 transition-[transform,scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Combobox.Empty className="text-gray-11 px-4 py-2 text-[0.925rem] leading-4 empty:m-0 empty:p-0">
              No options found.
            </Combobox.Empty>
            <Combobox.List>
              {(item: string) => (
                <Combobox.Item
                  className="text-16 data-highlighted:text-gray-12 data-highlighted:before:bg-gray-3 grid h-24 cursor-default grid-cols-[12px_1fr] items-center gap-2 py-2 pr-8 pl-4 leading-4 outline-none select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:before:absolute data-highlighted:before:inset-x-2 data-highlighted:before:inset-y-0 data-highlighted:before:z-[-1] data-highlighted:before:rounded-sm"
                  key={item}
                  value={item}
                >
                  <Combobox.ItemIndicator className="col-start-1">
                    <LucideCheck className="size-12" />
                  </Combobox.ItemIndicator>
                  <div className="col-start-2">{item}</div>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  )
}
