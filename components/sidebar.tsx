"use client"

import Link, { type LinkProps } from "next/link"
import { usePathname } from "next/navigation"
import { LucideCompass, LucidePlus } from "@nattui/icons"

const links: {
  href: LinkProps<string>["href"]
  icon: typeof LucideCompass
  label: string
}[] = [
  {
    href: "/",
    icon: LucideCompass,
    label: "Discover",
  },
  {
    href: "/create",
    icon: LucidePlus,
    label: "Create",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="bg-gray-1 sticky top-64 left-0 flex h-[calc(100dvh-64px)] shrink-0 flex-col">
      <div className="flex flex-col gap-y-4 overflow-y-auto px-24">
        {links.map((link, index) => {
          const isActive = pathname === link.href
          const Icon = link.icon

          return (
            <Link
              className="text-14 font-500 data-[is-active=true]:text-primary-9 hover:text-gray-12 flex w-fit items-center gap-x-8 transition-colors"
              data-is-active={isActive}
              href={link.href}
              key={index}
            >
              <Icon size={16} />
              {link.label}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
