import Link from "next/link"
import { LucideCheck, LucideMessageSquare } from "@nattui/icons"
import { BountyBadge } from "@/components/bounty-badge"
import type { Question } from "@/lib/types"
import { timeAgo } from "@/lib/utils"

export function QuestionCard({ question }: { question: Question }) {
  return (
    <Link
      className="border-gray-4 hover:border-gray-6 hover:bg-gray-2 flex flex-col gap-y-8 rounded-12 border px-16 py-14 transition-colors"
      href={`/question/${question.id}`}
    >
      <div className="flex items-start justify-between gap-x-12">
        <div className="flex items-center gap-x-8">
          <h3 className="text-gray-12 text-16 font-600 leading-snug">
            {question.title}
          </h3>
          {question.status === "answered" && (
            <span className="text-primary-11 bg-primary-3 flex shrink-0 items-center gap-x-4 rounded-6 px-6 py-2 text-11 font-600">
              <LucideCheck size={10} />
              Answered
            </span>
          )}
        </div>
        <BountyBadge amount={question.bounty_amount} />
      </div>

      <p className="text-gray-11 text-14 line-clamp-2 leading-relaxed">
        {question.body}
      </p>

      <div className="text-gray-10 flex items-center gap-x-8 text-12">
        <span className="capitalize">{question.category}</span>
        <span>·</span>
        <span>{question.author_name}</span>
        <span>·</span>
        <span>{timeAgo(question.created_at)}</span>
        <span className="ml-auto flex items-center gap-x-4">
          <LucideMessageSquare size={12} />
          {question.answer_count}
        </span>
      </div>
    </Link>
  )
}
