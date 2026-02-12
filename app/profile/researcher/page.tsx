"use client"

import { type FormEvent, useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LucideLoader, LucidePlus, LucideX } from "@nattui/icons"
import { Button, Input, Label, Spacer } from "@nattui/react-components"
import { authClient } from "@/lib/auth-client"

type ResearcherProfile = {
  id: string
  userId: string
  affiliation: string
  emailForVerification: string
  areasOfInterest: string[]
  homepage: string
  alternativeNames: string[]
  createdAt: string
  updatedAt: string
}

export default function ResearcherProfilePage() {
  const router = useRouter()
  const { data: session, isPending: sessionPending } = authClient.useSession()

  const [profile, setProfile] = useState<ResearcherProfile | null | "none">(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [affiliation, setAffiliation] = useState("")
  const [emailForVerification, setEmailForVerification] = useState("")
  const [areasOfInterestRaw, setAreasOfInterestRaw] = useState("")
  const [homepage, setHomepage] = useState("")
  const [alternativeNames, setAlternativeNames] = useState<string[]>([])
  const [newAltName, setNewAltName] = useState("")

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile/researcher")
      if (!res.ok) return
      const data = await res.json()
      if (data.profile) {
        setProfile(data.profile)
        setAffiliation(data.profile.affiliation ?? "")
        setEmailForVerification(data.profile.emailForVerification ?? "")
        setAreasOfInterestRaw((data.profile.areasOfInterest ?? []).join(", "))
        setHomepage(data.profile.homepage ?? "")
        setAlternativeNames(data.profile.alternativeNames ?? [])
      } else {
        setProfile("none")
      }
    } catch {
      setProfile("none")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!sessionPending && session) {
      fetchProfile()
    }
  }, [sessionPending, session, fetchProfile])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)

    const areas = areasOfInterestRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)

    try {
      const res = await fetch("/api/profile/researcher", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliation: affiliation.trim(),
          emailForVerification: emailForVerification.trim(),
          areasOfInterest: areas,
          homepage: homepage.trim(),
          alternativeNames,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? "Failed to save")
        setSaving(false)
        return
      }
      const data = await res.json()
      setProfile(data.profile)
      router.push("/profile")
    } catch {
      setError("Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  function addAlternativeName() {
    const name = newAltName.trim()
    if (!name || alternativeNames.includes(name)) return
    setAlternativeNames((prev) => [...prev, name])
    setNewAltName("")
  }

  function removeAlternativeName(name: string) {
    setAlternativeNames((prev) => prev.filter((n) => n !== name))
  }

  if (sessionPending || loading) {
    return (
      <div className="flex items-center justify-center py-48">
        <LucideLoader className="text-gray-10 animate-spin" size={24} />
      </div>
    )
  }

  if (!session) {
    router.push("/signin")
    return null
  }

  return (
    <div className="mx-auto flex w-full max-w-720 flex-col md:flex-row md:gap-32">
      {/* Step nav (Scholar-style) */}
      <nav className="border-gray-4 flex shrink-0 flex-col gap-4 rounded-12 border p-16 md:w-180">
        <div className="bg-primary-3 text-primary-11 flex size-32 shrink-0 items-center justify-center rounded-full text-14 font-600">
          1
        </div>
        <span className="text-gray-12 text-14 font-600">Profile</span>
        <div className="text-gray-8 flex size-32 shrink-0 items-center justify-center rounded-full text-14 font-600">
          2
        </div>
        <span className="text-gray-10 text-14">Articles</span>
        <div className="text-gray-8 flex size-32 shrink-0 items-center justify-center rounded-full text-14 font-600">
          3
        </div>
        <span className="text-gray-10 text-14">Settings</span>
      </nav>

      {/* Main form */}
      <main className="min-w-0 flex-1">
        <h1 className="text-20 font-600 text-gray-12">
          Verify identity and complete your researcher profile
        </h1>
        <p className="text-gray-11 mt-8 text-14">
          This helps the community trust your work and connect you with relevant questions.
        </p>
        <Spacer className="h-24" />

        <div className="text-gray-11 mb-16 text-13">
          Account: {session.user.email}{" "}
          <Link className="text-primary-11 hover:underline" href="/profile">
            Switch account
          </Link>
        </div>

        <form className="flex flex-col gap-20" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name">Name</Label>
            <p className="text-gray-10 text-12">Full name as it appears on your work</p>
            <Spacer className="h-4" />
            <Input
              className="bg-gray-2"
              id="name"
              readOnly
              value={session.user.name ?? ""}
            />
            <p className="text-primary-11 mt-4 text-12">
              <Link href="/profile">Edit name on profile</Link>
            </p>
          </div>

          <div>
            <Label>Alternative names</Label>
            <p className="text-gray-10 text-12">E.g. maiden name, different script</p>
            <Spacer className="h-4" />
            <div className="flex flex-wrap gap-8">
              {alternativeNames.map((name) => (
                <span
                  key={name}
                  className="border-gray-5 bg-gray-2 text-gray-12 inline-flex items-center gap-4 rounded-8 border px-10 py-6 text-13"
                >
                  {name}
                  <button
                    className="text-gray-10 hover:text-red-11"
                    onClick={() => removeAlternativeName(name)}
                    type="button"
                    aria-label={`Remove ${name}`}
                  >
                    <LucideX size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-8 flex gap-8">
              <Input
                onChange={(e) => setNewAltName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAlternativeName())}
                placeholder="Add another name"
                value={newAltName}
              />
              <Button
                iconStart={<LucidePlus size={14} />}
                onClick={addAlternativeName}
                type="button"
                variant="outline"
              >
                Add
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="affiliation">Affiliation</Label>
            <p className="text-gray-10 text-12">E.g., Professor of Physics, Princeton University</p>
            <Spacer className="h-4" />
            <Input
              id="affiliation"
              onChange={(e) => setAffiliation(e.target.value)}
              placeholder="E.g., Professor of Physics, Princeton University"
              value={affiliation}
            />
          </div>

          <div>
            <Label htmlFor="email-verification">Email for verification</Label>
            <p className="text-gray-10 text-12">E.g., einstein@princeton.edu</p>
            <Spacer className="h-4" />
            <Input
              id="email-verification"
              onChange={(e) => setEmailForVerification(e.target.value)}
              placeholder="E.g., einstein@princeton.edu"
              type="email"
              value={emailForVerification}
            />
          </div>

          <div>
            <Label htmlFor="areas">Areas of interest</Label>
            <p className="text-gray-10 text-12">E.g., general relativity, unified field theory (comma-separated)</p>
            <Spacer className="h-4" />
            <Input
              id="areas"
              onChange={(e) => setAreasOfInterestRaw(e.target.value)}
              placeholder="E.g., general relativity, unified field theory"
              value={areasOfInterestRaw}
            />
          </div>

          <div>
            <Label htmlFor="homepage">Homepage (optional)</Label>
            <p className="text-gray-10 text-12">E.g., https://example.edu/~researcher</p>
            <Spacer className="h-4" />
            <Input
              id="homepage"
              onChange={(e) => setHomepage(e.target.value)}
              placeholder="E.g., https://example.edu/~researcher"
              type="url"
              value={homepage}
            />
          </div>

          {error && <p className="text-red-11 text-14">{error}</p>}

          <div className="flex gap-12">
            <Button
              iconStart={saving ? <LucideLoader className="animate-spin" size={16} /> : undefined}
              isDisabled={saving}
              size={44}
              type="submit"
              variant="accent"
            >
              {saving ? "Saving..." : "Save profile"}
            </Button>
            <Link
              className="inline-flex h-44 items-center justify-center rounded-10 px-16 text-14 font-500 text-gray-11 hover:bg-gray-3 hover:text-gray-12"
              href="/profile"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
