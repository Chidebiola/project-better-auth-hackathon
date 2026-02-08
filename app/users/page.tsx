"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import {
  LucideCheck,
  LucideLoader,
  LucideMessageSquare,
  LucideUsers,
} from "@nattui/icons"
import { Spacer } from "@nattui/react-components"
import { timeAgo } from "@/lib/utils"

type User = {
  id: string
  name: string
  email: string
  createdAt: string
  questions_count: number
  answers_count: number
  accepted_count: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setUsers(data)
    } catch {
      console.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-x-10">
        <LucideUsers className="text-gray-11" size={20} />
        <h1 className="text-24 font-600 text-gray-12">Users</h1>
      </div>

      <Spacer className="h-4" />

      <p className="text-gray-11 text-14">
        All community members.
      </p>

      <Spacer className="h-24" />

      {loading ? (
        <div className="flex items-center justify-center py-48">
          <LucideLoader className="text-gray-10 animate-spin" size={20} />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center gap-y-8 py-48">
          <p className="text-gray-11 text-14">No users yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-y-8">
          {users.map((user) => (
            <Link
              className="border-gray-4 hover:border-gray-6 hover:bg-gray-2 flex items-center gap-x-14 rounded-12 border px-16 py-14 transition-colors"
              href={`/${user.id}`}
              key={user.id}
            >
              <div className="bg-primary-3 text-primary-11 flex size-40 shrink-0 items-center justify-center rounded-full text-16 font-600">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-y-2">
                <div className="flex items-center gap-x-8">
                  <span className="text-gray-12 text-15 font-600 truncate">
                    {user.name}
                  </span>
                  <span className="text-gray-10 text-12">
                    Joined {timeAgo(user.createdAt)}
                  </span>
                </div>

                <div className="text-gray-10 flex items-center gap-x-12 text-13">
                  <span className="flex items-center gap-x-4">
                    <LucideMessageSquare size={12} />
                    {user.questions_count} {user.questions_count === 1 ? "question" : "questions"}
                  </span>
                  <span className="flex items-center gap-x-4">
                    <LucideMessageSquare size={12} />
                    {user.answers_count} {user.answers_count === 1 ? "answer" : "answers"}
                  </span>
                  {user.accepted_count > 0 && (
                    <span className="text-primary-11 flex items-center gap-x-4">
                      <LucideCheck size={12} />
                      {user.accepted_count} accepted
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
