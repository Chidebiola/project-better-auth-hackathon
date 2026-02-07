import Link from "next/link"
import { Logomark } from "@/components/logomark"
import { Logotype } from "@/components/logotype"

export function Topbar() {
  return (
    <header className="bg-gray-1 sticky top-0 left-0 z-10 flex h-64 w-full px-24">
      <div className="flex size-full items-center justify-between">
        <Link
          className="-ml-8 flex items-center gap-x-8 p-8 transition-opacity hover:opacity-75"
          href="/button"
        >
          <Logomark className="text-primary-9" />
          <Logotype className="text-gray-12" />
        </Link>
      </div>
    </header>
  )
}
