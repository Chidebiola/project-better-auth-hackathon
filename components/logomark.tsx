import type { ComponentProps } from "react"

interface LogomarkProps extends ComponentProps<"svg"> { }

export function Logomark(props: LogomarkProps) {
  const { ...rest } = props

  return (
    <svg width="28" height="21" viewBox="0 0 28 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-6.11959e-07 7C7.73199 7 14 13.268 14 21C14 13.268 20.268 7 28 7C28 14.732 21.732 21 14 21C6.26801 21 -2.73984e-07 14.732 -6.11959e-07 7Z" fill="#12A594" />
      <path d="M7 7C10.866 7 14 3.86599 14 -7.01366e-07C14 3.86599 17.134 7 21 7C17.134 7 14 10.134 14 14C14 10.134 10.866 7 7 7Z" fill="#12A594" />
    </svg>
  )
}
