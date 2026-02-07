"use client"

import { type FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { LucideLoader, LucideSend } from "@nattui/icons"
import { Button, Input, Label, Spacer } from "@nattui/react-components"
import { categories } from "@/components/carousel-category/categories"
import { authClient } from "@/lib/auth-client"

export default function CreatePage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [category, setCategory] = useState("all")
  const [bountyAmount, setBountyAmount] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Title is required")
      return
    }

    if (!body.trim()) {
      setError("Details are required")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/questions", {
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          category,
          bountyAmount: Number.parseInt(bountyAmount) || 0,
        }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to create question")
        setLoading(false)
        return
      }

      const question = await res.json()
      router.push(`/question/${question.id}`)
    } catch {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  if (isPending) {
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

  return (
    <div className="flex w-full flex-col items-center">
      <form className="flex w-full max-w-560 flex-col" onSubmit={handleSubmit}>
        <h1 className="text-24 font-semibold">Ask a question</h1>
        <Spacer className="h-8" />
        <p className="text-gray-11 text-14">
          Get help from the community. Add a bounty to attract better answers.
        </p>

        <Spacer className="h-32" />

        {error && (
          <>
            <p className="text-red-11 text-14">{error}</p>
            <Spacer className="h-16" />
          </>
        )}

        <Label htmlFor="title">Title</Label>
        <Spacer className="h-4" />
        <Input
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What's your question?"
          type="text"
          value={title}
        />

        <Spacer className="h-16" />

        <Label htmlFor="body">Details</Label>
        <Spacer className="h-4" />
        <textarea
          className="bg-gray-2 border-gray-6 text-gray-12 placeholder:text-gray-10 focus:border-primary-8 min-h-128 w-full rounded-8 border px-12 py-10 text-14 outline-none transition-colors"
          id="body"
          onChange={(e) => setBody(e.target.value)}
          placeholder="Provide more context to help others answer your question..."
          value={body}
        />

        <Spacer className="h-16" />

        <Label>Category</Label>
        <Spacer className="h-4" />
        <div className="flex flex-wrap gap-6">
          {categories.map((cat) => (
            <button
              className={`rounded-8 text-14 font-500 h-32 shrink-0 cursor-pointer px-8 transition-colors ${
                category === cat.value
                  ? "bg-gray-12 text-gray-1"
                  : "bg-gray-3 text-gray-12 hover:bg-gray-4"
              }`}
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
        </div>

        <Spacer className="h-16" />

        <Label htmlFor="bounty">Bounty amount ($)</Label>
        <Spacer className="h-4" />
        <Input
          id="bounty"
          min="0"
          onChange={(e) => setBountyAmount(e.target.value)}
          placeholder="0"
          type="number"
          value={bountyAmount}
        />
        <Spacer className="h-4" />
        <p className="text-gray-10 text-12">Optional. Set a bounty to attract better answers.</p>

        <Spacer className="h-24" />

        <Button
          iconStart={loading ? <LucideLoader className="animate-spin" size={16} /> : <LucideSend size={16} />}
          isDisabled={loading}
          isFullWidth
          size={44}
          type="submit"
          variant="accent"
        >
          {loading ? "Posting..." : "Post question"}
        </Button>
      </form>
    </div>
  )
}
