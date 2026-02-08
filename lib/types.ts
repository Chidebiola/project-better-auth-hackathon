export type Question = {
  id: string
  author_id: string
  author_name: string
  title: string
  body: string
  bounty_amount: number
  category: string
  status: "open" | "answered" | "closed"
  answer_count: string
  created_at: string
  updated_at: string
}

export type Answer = {
  id: string
  question_id: string
  author_id: string
  author_name: string
  body: string
  images: string[]
  is_accepted: boolean
  created_at: string
  updated_at: string
}

export type AnswerRequest = {
  id: string
  question_id: string
  user_id: string
  user_name: string
  status: "pending" | "selected" | "rejected"
  created_at: string
}

export type QuestionWithAnswers = Question & {
  answers: Answer[]
  answer_requests: AnswerRequest[]
}
