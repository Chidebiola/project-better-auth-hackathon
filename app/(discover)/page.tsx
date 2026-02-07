"use client"

import { useCallback, useEffect, useState } from "react"
import { LucideLoader } from "@nattui/icons"
import { CarouselCategory } from "@/components/carousel-category/carousel-category"
import { QuestionCard } from "@/components/question-card"
import type { Question } from "@/lib/types"

export default function DiscoverPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  const fetchQuestions = useCallback(async (cat: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (cat && cat !== "all") {
        params.set("category", cat)
      }
      const res = await fetch(`/api/questions?${params.toString()}`)
      const data = await res.json()
      setQuestions(data)
    } catch {
      console.error("Failed to fetch questions")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuestions(category)
  }, [category, fetchQuestions])

  function onCategoryChange(newCategory: string) {
    setCategory(newCategory)
  }

  return (
    <div className="flex flex-col">
      <CarouselCategory onCategoryChange={onCategoryChange} />

      <div className="mt-16 flex flex-col gap-y-12">
        {loading ? (
          <div className="flex items-center justify-center py-48">
            <LucideLoader className="text-gray-10 animate-spin" size={20} />
          </div>
        ) : questions.length === 0 ? (
          <div className="flex flex-col items-center gap-y-8 py-48">
            <p className="text-gray-11 text-14">No questions yet.</p>
            <p className="text-gray-10 text-14">Be the first to ask one!</p>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))
        )}
      </div>
    </div>
  )
}
