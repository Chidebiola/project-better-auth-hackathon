"use client"

import { LucideCheck, LucideDollarSign, LucideLoader } from "@nattui/icons"
import { Button } from "@nattui/react-components"
import type { Answer } from "@/lib/types"
import { timeAgo } from "@/lib/utils"

type AnswerCardProps = {
  answer: Answer
  bountyAmount: number
  currentUserId?: string
  isQuestionAuthor: boolean
  questionStatus: string
  onAccept?: (answerId: string) => void
  isAccepting?: boolean
}

export function AnswerCard(props: AnswerCardProps) {
  const { answer, bountyAmount, currentUserId, isQuestionAuthor, questionStatus, onAccept, isAccepting } = props

  const isAnswerAuthor = currentUserId === answer.author_id
  const showEarnings = answer.is_accepted && isAnswerAuthor && bountyAmount > 0

  return (
    <div className={`border-gray-4 flex gap-x-12 rounded-12 border ${answer.is_accepted ? "border-primary-6 bg-primary-2" : ""}`}>
      <div className="flex flex-1 flex-col gap-y-8 px-16 py-14">
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

      {showEarnings && (
        <div className="border-primary-6 flex w-160 shrink-0 flex-col items-center justify-center gap-y-6 border-l px-16 py-14">
          <div className="bg-primary-3 flex size-40 items-center justify-center rounded-full">
            <LucideDollarSign className="text-primary-11" size={20} />
          </div>
          <p className="text-primary-11 text-center text-12 font-600">
            Answer accepted!
          </p>
          <p className="text-primary-12 text-20 font-700">
            ${bountyAmount}
          </p>
          <p className="text-primary-10 text-center text-11">
            earned
          </p>
        </div>
      )}
    </div>
  )
}
