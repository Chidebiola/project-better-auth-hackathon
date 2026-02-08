"use client"

import { LucideCheck, LucideLoader } from "@nattui/icons"
import { Button } from "@nattui/react-components"
import type { Answer } from "@/lib/types"
import { timeAgo } from "@/lib/utils"

type AnswerCardProps = {
  answer: Answer
  isQuestionAuthor: boolean
  questionStatus: string
  onAccept?: (answerId: string) => void
  isAccepting?: boolean
}

export function AnswerCard(props: AnswerCardProps) {
  const { answer, isQuestionAuthor, questionStatus, onAccept, isAccepting } = props

  return (
    <div className={`border-gray-4 flex flex-col gap-y-8 rounded-12 border px-16 py-14 ${answer.is_accepted ? "border-primary-6 bg-primary-2" : ""}`}>
      <div className="flex items-center justify-between">
        <div className="text-gray-10 flex items-center gap-x-8 text-12">
          <span className="text-gray-12 font-500">{answer.author_name}</span>
          <span>·</span>
          <span>{timeAgo(answer.created_at)}</span>
        </div>
        {answer.is_accepted && (
          <span className="text-primary-11 bg-primary-3 text-12 font-600 rounded-6 flex items-center gap-x-4 px-8 py-2">
            <LucideCheck size={12} />
            Accepted
          </span>
        )}
      </div>

      <p className="text-gray-12 text-14 whitespace-pre-wrap leading-relaxed">
        {answer.body}
      </p>

      {answer.images && answer.images.length > 0 && (
        <div className="flex flex-wrap gap-8">
          {answer.images.map((url, index) => (
            <a
              href={url}
              key={url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                alt={`Image ${index + 1}`}
                className="border-gray-4 hover:border-gray-6 max-h-200 rounded-8 border object-cover transition-colors"
                src={url}
              />
            </a>
          ))}
        </div>
      )}

      {isQuestionAuthor && !answer.is_accepted && questionStatus === "open" && onAccept && (
        <div className="flex justify-end">
          <Button
            iconStart={isAccepting ? <LucideLoader className="animate-spin" size={14} /> : <LucideCheck size={14} />}
            isDisabled={isAccepting}
            onClick={() => onAccept(answer.id)}
            size={32}
            variant="ghost"
          >
            Accept answer
          </Button>
        </div>
      )}
    </div>
  )
}
