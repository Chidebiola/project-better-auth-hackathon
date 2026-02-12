"use client"

import { type FormEvent, useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LucideCheck,
  LucideLoader,
  LucideMessageSquare,
  LucidePencil,
  LucideUserCircle,
  LucideX,
} from "@nattui/icons"
import { Button, Input, Spacer } from "@nattui/react-components"
import { QuestionCard } from "@/components/question-card"
import { authClient } from "@/lib/auth-client"
import type { Question } from "@/lib/types"

type ResearcherProfile = {
  id: string
  affiliation: string
  emailForVerification: string
  areasOfInterest: string[]
  homepage: string
  alternativeNames: string[]
}

type ProfileData = {
  user: {
    id: string
    name: string
    email: string
    createdAt: string
  }
  questions: Question[]
  stats: {
    questionsCount: number
    answersCount: number
    acceptedAnswersCount: number
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [researcherProfile, setResearcherProfile] = useState<ResearcherProfile | null | "none">(null)
  const [loading, setLoading] = useState(true)

  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const fetchProfile = useCallback(async () => {
    try {
      const [profileRes, researcherRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/profile/researcher"),
      ])
      if (profileRes.ok) {
        const data = await profileRes.json()
        setProfile(data)
      }
      if (researcherRes.ok) {
        const data = await researcherRes.json()
        setResearcherProfile(data.profile ? data.profile : "none")
      } else {
        setResearcherProfile("none")
      }
    } catch {
      console.error("Failed to fetch profile")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isPending && session) {
      fetchProfile()
    }
  }, [isPending, session, fetchProfile])

  async function handleSaveName(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!editName.trim()) {
      setError("Name cannot be empty")
      return
    }

    setSaving(true)

    try {
      await authClient.updateUser({
        name: editName.trim(),
      })

      setIsEditing(false)
      await fetchProfile()
    } catch {
      setError("Failed to update name")
    } finally {
      setSaving(false)
    }
  }

  function startEditing() {
    setEditName(profile?.user.name ?? "")
    setError("")
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setError("")
  }

  if (isPending || loading) {
    return (
      <div className="flex items-center justify-center py-48">
        <LucideLoader className="text-gray-10 animate-spin" size={20} />
      </div>
    )
  }

  if (!session) {
    router.push("/signin")
    return null
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center gap-y-8 py-48">
        <p className="text-gray-11 text-16">Failed to load profile.</p>
        <Button onClick={() => fetchProfile()} size={36} variant="ghost">
          Try again
        </Button>
      </div>
    )
  }

  const joinedDate = new Date(profile.user.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    },
  )

  return (
    <div className="flex flex-col">
      {/* Profile header */}
      <div className="flex flex-col gap-y-4">
        <div className="bg-primary-3 text-primary-11 flex size-64 items-center justify-center rounded-full text-24 font-600">
          {profile.user.name.charAt(0).toUpperCase()}
        </div>

        <Spacer className="h-8" />

        {isEditing ? (
          <form className="flex items-center gap-x-8" onSubmit={handleSaveName}>
            <Input
              autoFocus
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your name"
              type="text"
              value={editName}
            />
            <Button
              iconStart={
                saving ? (
                  <LucideLoader className="animate-spin" size={16} />
                ) : (
                  <LucideCheck size={16} />
                )
              }
              isDisabled={saving}
              size={36}
              type="submit"
              variant="accent"
            >
              Save
            </Button>
            <Button
              iconStart={<LucideX size={16} />}
              onClick={cancelEditing}
              size={36}
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
          </form>
        ) : (
          <div className="flex items-center gap-x-8">
            <h1 className="text-24 font-600 text-gray-12">
              {profile.user.name}
            </h1>
            <button
              className="text-gray-10 hover:text-gray-12 cursor-pointer transition-colors"
              onClick={startEditing}
              type="button"
            >
              <LucidePencil size={14} />
            </button>
          </div>
        )}

        {error && <p className="text-red-11 text-14">{error}</p>}

        <p className="text-gray-11 text-14">{profile.user.email}</p>
        <p className="text-gray-10 text-13">Joined {joinedDate}</p>
      </div>

      <Spacer className="h-32" />

      {/* Stats */}
      <div className="flex gap-x-16">
        <div className="border-gray-4 flex flex-1 flex-col items-center gap-y-2 rounded-12 border px-16 py-14">
          <span className="text-gray-12 text-20 font-600">
            {profile.stats.questionsCount}
          </span>
          <span className="text-gray-10 text-13">Questions</span>
        </div>
        <div className="border-gray-4 flex flex-1 flex-col items-center gap-y-2 rounded-12 border px-16 py-14">
          <span className="text-gray-12 text-20 font-600">
            {profile.stats.answersCount}
          </span>
          <span className="text-gray-10 text-13">Answers</span>
        </div>
        <div className="border-gray-4 flex flex-1 flex-col items-center gap-y-2 rounded-12 border px-16 py-14">
          <span className="text-gray-12 text-20 font-600">
            {profile.stats.acceptedAnswersCount}
          </span>
          <span className="text-gray-10 text-13">Accepted</span>
        </div>
      </div>

      <Spacer className="h-32" />

      {/* Researcher profile */}
      <div className="border-gray-4 flex flex-col gap-y-12 rounded-12 border px-16 py-14">
        <div className="flex items-center justify-between gap-x-8">
          <div className="flex items-center gap-x-8">
            <LucideUserCircle className="text-gray-11" size={18} />
            <h2 className="text-16 font-600 text-gray-12">Researcher profile</h2>
          </div>
          {(researcherProfile === null || researcherProfile === "none") ? (
            <Button
              onClick={() => router.push("/profile/researcher")}
              size={36}
              variant="accent"
            >
              Complete researcher profile
            </Button>
          ) : (
            <Link
              className="text-primary-11 hover:text-primary-12 text-14 font-500"
              href="/profile/researcher"
            >
              Edit
            </Link>
          )}
        </div>
        {researcherProfile && researcherProfile !== "none" ? (
          <div className="text-gray-11 flex flex-col gap-y-6 text-14">
            {researcherProfile.affiliation && (
              <p>
                <span className="text-gray-10 font-500">Affiliation:</span>{" "}
                {researcherProfile.affiliation}
              </p>
            )}
            {researcherProfile.areasOfInterest?.length > 0 && (
              <p>
                <span className="text-gray-10 font-500">Areas of interest:</span>{" "}
                {researcherProfile.areasOfInterest.join(", ")}
              </p>
            )}
            {researcherProfile.homepage && (
              <p>
                <span className="text-gray-10 font-500">Homepage:</span>{" "}
                <a
                  className="text-primary-11 hover:underline"
                  href={researcherProfile.homepage}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {researcherProfile.homepage}
                </a>
              </p>
            )}
            {!researcherProfile.affiliation &&
              !researcherProfile.areasOfInterest?.length &&
              !researcherProfile.homepage && (
                <p className="text-gray-10">Add affiliation and interests.</p>
              )}
          </div>
        ) : (
          <p className="text-gray-10 text-14">
            Verify your identity and add affiliation, areas of interest, and optional homepage so
            the community can connect with your work.
          </p>
        )}
      </div>

      <Spacer className="h-32" />

      {/* Divider */}
      <div className="bg-gray-4 h-1" />

      <Spacer className="h-24" />

      {/* User's questions */}
      <div className="flex items-center gap-x-8">
        <LucideMessageSquare className="text-gray-11" size={16} />
        <h2 className="text-16 font-600 text-gray-12">Your questions</h2>
      </div>

      <Spacer className="h-16" />

      {profile.questions.length === 0 ? (
        <div className="flex flex-col items-center gap-y-8 py-32">
          <p className="text-gray-11 text-14">
            You haven't asked any questions yet.
          </p>
          <Button
            onClick={() => router.push("/create")}
            size={36}
            variant="accent"
          >
            Ask your first question
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-y-12">
          {profile.questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  )
}
