import type { ComponentProps } from "react"

interface LogomarkProps extends ComponentProps<"svg"> {}

export function Logomark(props: LogomarkProps) {
  const { ...rest } = props

  return (
    <svg
      fill="currentColor"
      height="18"
      viewBox="0 0 24 18"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <title>Logomark</title>
      <path d="M18 0H24V6H18V0Z" />
      <path d="M22.6298 11.1117C23.5344 13.2956 24 15.6362 24 18H18C18 16.4241 17.6896 14.8637 17.0866 13.4078C16.4835 11.9519 15.5996 10.629 14.4853 9.51472C13.371 8.40042 12.0481 7.5165 10.5922 6.91345C9.13629 6.31039 7.57586 6 6 6V0C8.36379 0 10.7044 0.465584 12.8883 1.37017C15.0722 2.27475 17.0565 3.60062 18.7279 5.27208C20.3994 6.94353 21.7252 8.92784 22.6298 11.1117Z" />
      <path d="M0 6H6V18H0V6Z" />
    </svg>
  )
}
