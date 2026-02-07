"use client"

import { type FormEvent, useCallback, useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { LucideArrowLeft, LucideLoader, LucideMessageSquare, LucideSend } from "@nattui/icons"
import { Button, Spacer } from "@nattui/react-components"
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
  const [error, setError] = useState("")

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

      {/* Question header */}
      <div className="flex flex-col gap-y-8">
        <div className="flex items-start justify-between gap-x-12">
          <h1 className="text-24 font-600 text-gray-12 leading-snug">
            {question.title}
          </h1>
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

      {/* Question body */}
      <div className="text-gray-12 text-15 whitespace-pre-wrap leading-relaxed">
        {question.body}
      </div>

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
        <p className="text-gray-10 py-16 text-14">No answers yet. Be the first to help!</p>
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

      {/* Answer form */}
      {session ? (
        question.status !== "closed" && (
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
        )
      ) : (
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
    </div>
  )
}
