"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LucideEye,
  LucideEyeOff,
  LucideLock,
  LucideMail,
  LucideUser,
  LucideUserPlus,
} from "@nattui/icons"
import { Button, Input, Label, Spacer } from "@nattui/react-components"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full max-w-360 flex-col">
        <h1 className="text-24 font-semibold">Create an account</h1>
        <Spacer className="h-8" />
        <p className="text-gray-11 text-14">
          Enter your details to get started.
        </p>

        <Spacer className="h-32" />

        <Label htmlFor="name">Name</Label>
        <Spacer className="h-4" />
        <div className="relative">
          <LucideUser
            className="text-gray-11 pointer-events-none absolute top-14 left-14"
            size={16}
          />
          <Input
            autoComplete="name"
            className="pl-44!"
            id="name"
            placeholder="John Doe"
            type="text"
          />
        </div>

        <Spacer className="h-16" />

        <Label htmlFor="email">Email</Label>
        <Spacer className="h-4" />
        <div className="relative">
          <LucideMail
            className="text-gray-11 pointer-events-none absolute top-14 left-14"
            size={16}
          />
          <Input
            autoComplete="email"
            className="pl-44!"
            id="email"
            placeholder="name@example.com"
            type="email"
          />
        </div>

        <Spacer className="h-16" />

        <Label htmlFor="password">Password</Label>
        <Spacer className="h-4" />
        <div className="relative">
          <LucideLock
            className="text-gray-11 pointer-events-none absolute top-14 left-14"
            size={16}
          />
          <Input
            autoComplete="new-password"
            className="px-44!"
            id="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
          />
          <Button
            className="group absolute! top-6 right-6"
            iconOnly
            onClick={() => setShowPassword((prev) => !prev)}
            size={32}
            variant="ghost"
          >
            {showPassword ? (
              <LucideEyeOff
                className="text-gray-11 group-hover:text-gray-12 group-active:text-gray-12 transition-colors"
                size={16}
              />
            ) : (
              <LucideEye
                className="text-gray-11 group-hover:text-gray-12 group-active:text-gray-12 transition-colors"
                size={16}
              />
            )}
          </Button>
        </div>

        <Spacer className="h-24" />

        <Button iconStart={<LucideUserPlus size={16} />} isFullWidth size={44} variant="accent">
          Sign up
        </Button>

        <Spacer className="h-24" />

        <p className="text-gray-11 text-center text-14">
          Already have an account?{" "}
          <Link className="text-primary-11 hover:text-primary-12 transition-colors" href="/signin">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
