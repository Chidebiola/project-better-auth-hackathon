"use client"

import { type FormEvent, useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  LucideArrowLeft,
  LucideCheck,
  LucideHand,
  LucideLoader,
  LucideMessageSquare,
  LucidePencil,
  LucideSend,
  LucideTrash,
  LucideUserCheck,
  LucideUsers,
  LucideX,
} from "@nattui/icons"
import { Button, Input, Spacer } from "@nattui/react-components"
import { categories } from "@/components/carousel-category/categories"
import { AnswerCard } from "@/components/answer-card"
import { BountyBadge } from "@/components/bounty-badge"
import { authClient } from "@/lib/auth-client"
import type { QuestionWithAnswers } from "@/lib/types"
import { timeAgo } from "@/lib/utils"

export default function QuestionDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { data: session } = authClient.useSession()

  const [question, setQuestion] = useState<QuestionWithAnswers | null>(null)
  const [loading, setLoading] = useState(true)
  const [answerBody, setAnswerBody] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [acceptingId, setAcceptingId] = useState<string | null>(null)
  const [volunteering, setVolunteering] = useState(false)
  const [selectingId, setSelectingId] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Editing state
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState("")
  const [editBody, setEditBody] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editBounty, setEditBounty] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchQuestion = useCallback(async () => {
    try {
      const res = await fetch(`/api/questions/${params.id}`)
      if (!res.ok) {
        setQuestion(null)
        return
      }
      const data = await res.json()
      setQuestion(data)
    } catch {
      console.error("Failed to fetch question")
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchQuestion()
  }, [fetchQuestion])

  async function handleVolunteer() {
    setVolunteering(true)
    setError("")

    try {
      const res = await fetch(`/api/questions/${params.id}/volunteer`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to volunteer")
        return
      }

      await fetchQuestion()
    } catch {
      setError("Something went wrong")
    } finally {
      setVolunteering(false)
    }
  }

  async function handleSelectUser(userId: string) {
    setSelectingId(userId)

    try {
      const res = await fetch(`/api/questions/${params.id}/select`, {
        body: JSON.stringify({ userId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (res.ok) {
        await fetchQuestion()
      }
    } catch {
      console.error("Failed to select user")
    } finally {
      setSelectingId(null)
    }
  }

  async function handleSubmitAnswer(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!answerBody.trim()) {
      setError("Answer cannot be empty")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch(`/api/questions/${params.id}/answers`, {
        body: JSON.stringify({ body: answerBody.trim() }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to submit answer")
        setSubmitting(false)
        return
      }

      setAnswerBody("")
      await fetchQuestion()
    } catch {
      setError("Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleAcceptAnswer(answerId: string) {
    setAcceptingId(answerId)

    try {
      const res = await fetch(`/api/questions/${params.id}/accept`, {
        body: JSON.stringify({ answerId }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (res.ok) {
        await fetchQuestion()
      }
    } catch {
      console.error("Failed to accept answer")
    } finally {
      setAcceptingId(null)
    }
  }

  function startEditing() {
    if (!question) return
    setEditTitle(question.title)
    setEditBody(question.body)
    setEditCategory(question.category)
    setEditBounty(String(question.bounty_amount || ""))
    setError("")
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setError("")
  }

  async function handleSaveEdit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!editTitle.trim()) {
      setError("Title is required")
      return
    }

    if (!editBody.trim()) {
      setError("Details are required")
      return
    }

    setSaving(true)

    try {
      const res = await fetch(`/api/questions/${params.id}`, {
        body: JSON.stringify({
          title: editTitle.trim(),
          body: editBody.trim(),
          category: editCategory,
          bountyAmount: Number.parseInt(editBounty) || 0,
        }),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to update question")
        return
      }

      setIsEditing(false)
      await fetchQuestion()
    } catch {
      setError("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this question? This cannot be undone.")) {
      return
    }

    setDeleting(true)

    try {
      const res = await fetch(`/api/questions/${params.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to delete question")
        return
      }

      router.push("/")
    } catch {
      setError("Something went wrong")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-48">
        <LucideLoader className="text-gray-10 animate-spin" size={20} />
      </div>
    )
  }

  if (!question) {
    return (
      <div className="flex flex-col items-center gap-y-8 py-48">
        <p className="text-gray-11 text-16">Question not found.</p>
        <Button onClick={() => router.push("/")} size={36} variant="ghost">
          Back to discover
        </Button>
      </div>
    )
  }

  const isAuthor = session?.user.id === question.author_id
  const userRequest = question.answer_requests?.find(
    (r) => r.user_id === session?.user.id,
  )
  const hasVolunteered = !!userRequest
  const isSelected = userRequest?.status === "selected"
  const hasAlreadyAnswered = question.answers.some(
    (a) => a.author_id === session?.user.id,
  )

  return (
    <div className="flex flex-col">
      {/* Back button */}
      <button
        className="text-gray-11 hover:text-gray-12 mb-16 flex w-fit cursor-pointer items-center gap-x-6 text-14 transition-colors"
        onClick={() => router.push("/")}
        type="button"
      >
        <LucideArrowLeft size={14} />
        Back
      </button>

      {/* Question header & body */}
      {isEditing ? (
        <form className="flex flex-col" onSubmit={handleSaveEdit}>
          <label className="text-gray-11 text-13 font-500" htmlFor="edit-title">Title</label>
          <Spacer className="h-4" />
          <Input
            autoFocus
            id="edit-title"
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Question title"
            type="text"
            value={editTitle}
          />

          <Spacer className="h-12" />

          <label className="text-gray-11 text-13 font-500" htmlFor="edit-body">Details</label>
          <Spacer className="h-4" />
          <textarea
            className="bg-gray-2 border-gray-6 text-gray-12 placeholder:text-gray-10 focus:border-primary-8 min-h-128 w-full rounded-8 border px-12 py-10 text-14 outline-none transition-colors"
            id="edit-body"
            onChange={(e) => setEditBody(e.target.value)}
            placeholder="Question details..."
            value={editBody}
          />

          <Spacer className="h-12" />

          <label className="text-gray-11 text-13 font-500">Category</label>
          <Spacer className="h-4" />
          <div className="flex flex-wrap gap-6">
            {categories.map((cat) => (
              <button
                className={`rounded-8 text-13 font-500 h-28 shrink-0 cursor-pointer px-8 transition-colors ${
                  editCategory === cat.value
                    ? "bg-gray-12 text-gray-1"
                    : "bg-gray-3 text-gray-12 hover:bg-gray-4"
                }`}
                key={cat.value}
                onClick={() => setEditCategory(cat.value)}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>

          <Spacer className="h-12" />

          <label className="text-gray-11 text-13 font-500" htmlFor="edit-bounty">Bounty amount ($)</label>
          <Spacer className="h-4" />
          <Input
            id="edit-bounty"
            min="0"
            onChange={(e) => setEditBounty(e.target.value)}
            placeholder="0"
            type="number"
            value={editBounty}
          />

          {error && (
            <>
              <Spacer className="h-8" />
              <p className="text-red-11 text-14">{error}</p>
            </>
          )}

          <Spacer className="h-16" />

          <div className="flex items-center gap-x-8">
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
              {saving ? "Saving..." : "Save changes"}
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
          </div>
        </form>
      ) : (
        <>
          <div className="flex flex-col gap-y-8">
            <div className="flex items-start justify-between gap-x-12">
              <div className="flex items-center gap-x-8">
                <h1 className="text-24 font-600 text-gray-12 leading-snug">
                  {question.title}
                </h1>
                {isAuthor && (
                  <div className="flex items-center gap-x-4">
                    <button
                      className="text-gray-10 hover:text-gray-12 cursor-pointer transition-colors"
                      onClick={startEditing}
                      type="button"
                    >
                      <LucidePencil size={14} />
                    </button>
                    <button
                      className="text-gray-10 hover:text-red-11 cursor-pointer transition-colors"
                      disabled={deleting}
                      onClick={handleDelete}
                      type="button"
                    >
                      {deleting ? <LucideLoader className="animate-spin" size={14} /> : <LucideTrash size={14} />}
                    </button>
                  </div>
                )}
              </div>
              <BountyBadge amount={question.bounty_amount} />
            </div>

            <div className="text-gray-10 flex items-center gap-x-8 text-13">
              <span className="capitalize">{question.category}</span>
              <span>·</span>
              <span>{question.author_name}</span>
              <span>·</span>
              <span>{timeAgo(question.created_at)}</span>
              <span>·</span>
              <span className={`font-500 ${question.status === "open" ? "text-primary-11" : "text-gray-10"}`}>
                {question.status === "open" ? "Open" : question.status === "answered" ? "Answered" : "Closed"}
              </span>
            </div>
          </div>

          <Spacer className="h-16" />

          <div className="text-gray-12 text-15 whitespace-pre-wrap leading-relaxed">
            {question.body}
          </div>
        </>
      )}

      <Spacer className="h-24" />

      {/* Volunteer to answer (for non-authors, not yet volunteered) */}
      {session && !isAuthor && !hasVolunteered && !hasAlreadyAnswered && question.status === "open" && (
        <div className="border-gray-4 bg-gray-2 flex items-center justify-between rounded-12 border px-16 py-14">
          <div className="flex flex-col gap-y-2">
            <p className="text-gray-12 text-14 font-500">Want to help?</p>
            <p className="text-gray-10 text-13">
              Volunteer to answer this question. The author will select who gets to respond.
            </p>
          </div>
          <Button
            iconStart={
              volunteering ? (
                <LucideLoader className="animate-spin" size={16} />
              ) : (
                <LucideHand size={16} />
              )
            }
            isDisabled={volunteering}
            onClick={handleVolunteer}
            size={36}
            variant="accent"
          >
            {volunteering ? "Sending..." : "Try to answer"}
          </Button>
        </div>
      )}

      {/* Volunteered status (for non-authors who already volunteered) */}
      {session && !isAuthor && hasVolunteered && !isSelected && (
        <div className="border-gray-6 bg-gray-2 flex items-center gap-x-10 rounded-12 border px-16 py-14">
          <LucideCheck className="text-gray-10" size={16} />
          <p className="text-gray-11 text-14">
            You've volunteered to answer. Waiting for the author to select you.
          </p>
        </div>
      )}

      {/* Selected status (for non-authors who got selected) */}
      {session && !isAuthor && isSelected && !hasAlreadyAnswered && (
        <div className="border-primary-6 bg-primary-2 flex items-center gap-x-10 rounded-12 border px-16 py-14">
          <LucideUserCheck className="text-primary-11" size={16} />
          <p className="text-primary-11 text-14 font-500">
            You've been selected to answer! Write your answer below.
          </p>
        </div>
      )}

      {/* Volunteers list (visible to question author) */}
      {isAuthor && question.answer_requests && question.answer_requests.length > 0 && (
        <>
          <Spacer className="h-16" />

          <div className="border-gray-4 rounded-12 border">
            <div className="flex items-center gap-x-8 px-16 py-12">
              <LucideUsers className="text-gray-11" size={16} />
              <h2 className="text-14 font-600 text-gray-12">
                Volunteers ({question.answer_requests.length})
              </h2>
            </div>

            <div className="bg-gray-4 h-px" />

            <div className="flex flex-col">
              {question.answer_requests.map((req) => (
                <div
                  className="flex items-center justify-between px-16 py-10"
                  key={req.id}
                >
                  <div className="flex items-center gap-x-8">
                    <div className="bg-gray-4 text-gray-12 flex size-28 items-center justify-center rounded-full text-12 font-600">
                      {req.user_name?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-12 text-14 font-500">
                        {req.user_name}
                      </span>
                      <span className="text-gray-10 text-12">
                        {timeAgo(req.created_at)}
                      </span>
                    </div>
                  </div>

                  <Button
                    iconStart={
                      selectingId === req.user_id ? (
                        <LucideLoader className="animate-spin" size={14} />
                      ) : req.status === "selected" ? (
                        <LucideUserCheck size={14} />
                      ) : (
                        <LucideCheck size={14} />
                      )
                    }
                    isDisabled={selectingId === req.user_id}
                    onClick={() => handleSelectUser(req.user_id)}
                    size={32}
                    variant={req.status === "selected" ? "accent" : "ghost"}
                  >
                    {req.status === "selected" ? "Selected" : "Select"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Spacer className="h-32" />

      {/* Divider */}
      <div className="bg-gray-4 h-1" />

      <Spacer className="h-24" />

      {/* Answers section */}
      <div className="flex items-center gap-x-8">
        <LucideMessageSquare className="text-gray-11" size={16} />
        <h2 className="text-16 font-600 text-gray-12">
          {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
        </h2>
      </div>

      <Spacer className="h-16" />

      {question.answers.length === 0 ? (
        <p className="text-gray-10 py-16 text-14">No answers yet.</p>
      ) : (
        <div className="flex flex-col gap-y-12">
          {question.answers.map((answer) => (
            <AnswerCard
              answer={answer}
              isAccepting={acceptingId === answer.id}
              isQuestionAuthor={isAuthor}
              key={answer.id}
              onAccept={handleAcceptAnswer}
              questionStatus={question.status}
            />
          ))}
        </div>
      )}

      <Spacer className="h-32" />

      {/* Answer form - only for selected users */}
      {session && isSelected && !hasAlreadyAnswered && question.status !== "closed" && (
        <form className="flex flex-col" onSubmit={handleSubmitAnswer}>
          <div className="bg-gray-4 h-1" />
          <Spacer className="h-24" />

          <h3 className="text-16 font-600 text-gray-12">Your answer</h3>
          <Spacer className="h-8" />

          {error && (
            <>
              <p className="text-red-11 text-14">{error}</p>
              <Spacer className="h-8" />
            </>
          )}

          <textarea
            className="bg-gray-2 border-gray-6 text-gray-12 placeholder:text-gray-10 focus:border-primary-8 min-h-128 w-full rounded-8 border px-12 py-10 text-14 outline-none transition-colors"
            onChange={(e) => setAnswerBody(e.target.value)}
            placeholder="Write your answer..."
            value={answerBody}
          />

          <Spacer className="h-12" />

          <div className="flex justify-end">
            <Button
              iconStart={submitting ? <LucideLoader className="animate-spin" size={16} /> : <LucideSend size={16} />}
              isDisabled={submitting}
              size={36}
              type="submit"
              variant="accent"
            >
              {submitting ? "Submitting..." : "Submit answer"}
            </Button>
          </div>
        </form>
      )}

      {/* Sign in prompt */}
      {!session && (
        <div className="text-gray-11 py-16 text-center text-14">
          <button
            className="text-primary-11 hover:text-primary-12 cursor-pointer transition-colors"
            onClick={() => router.push("/signin")}
            type="button"
          >
            Sign in
          </button>
          {" "}to answer this question.
        </div>
      )}

      {/* Error display for volunteer action */}
      {error && !isSelected && (
        <p className="text-red-11 mt-8 text-14">{error}</p>
      )}
    </div>
  )
}
