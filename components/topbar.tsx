"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LucideLogIn, LucideLogOut, LucidePlus, LucideUser, LucideUserPlus, LucideUsers } from "@nattui/icons"
import { Button } from "@nattui/react-components"
import { Logomark } from "@/components/logomark"
import { Logotype } from "@/components/logotype"
import { authClient } from "@/lib/auth-client"

export function Topbar() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  return (
    <header className="bg-gray-1 sticky top-0 left-0 z-10 flex h-64 w-full px-24">
      <div className="flex size-full items-center justify-between">
        <Link
          className="-ml-8 flex items-center gap-x-8 p-8 transition-opacity hover:opacity-75"
          href="/"
        >
          <Logomark className="text-primary-9" />
          <Logotype className="text-gray-12" />
        </Link>
        {!isPending && (
          <div className="flex items-center gap-x-8">
            <Button
              iconStart={<LucideUsers size={16} />}
              onClick={() => router.push("/users")}
              size={36}
              variant="ghost"
            >
              Users
            </Button>
            <Button
              iconStart={<LucidePlus size={16} />}
              onClick={() => router.push(session ? "/create" : "/signup")}
              size={36}
              variant="accent"
            >
              Ask question
            </Button>
            {session ? (
              <>
                <Button
                  iconStart={<LucideUser size={16} />}
                  onClick={() => router.push(`/${session.user.id}`)}
                  size={36}
                  variant="ghost"
                >
                  Profile
                </Button>
                <Button
                  iconStart={<LucideLogOut size={16} />}
                  onClick={async () => {
                    await authClient.signOut()
                    router.push("/signin")
                  }}
                  size={36}
                  variant="ghost"
                >
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button iconStart={<LucideLogIn size={16} />} onClick={() => router.push("/signin")} size={36} variant="ghost">
                  Sign in
                </Button>
                <Button iconStart={<LucideUserPlus size={16} />} onClick={() => router.push("/signup")} size={36} variant="ghost">
                  Sign up
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
