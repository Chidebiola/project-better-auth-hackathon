import {
  LucideBan,
  LucideCopy,
  LucideDownload,
  LucideEye,
  LucideLock,
  LucideLogIn,
  LucideMail,
} from "@nattui/icons"
import { Button, Input, Label, Spacer } from "@nattui/react-components"

export default function InputPage() {
  return (
    <div className="flex w-full max-w-320 flex-col">
      <Label htmlFor="email">Email</Label>
      <Spacer className="h-4" />
      <div className="relative">
        <LucideMail
          className="text-gray-11 pointer-events-none absolute top-14 left-14"
          size={16}
        />
        <Input className="pl-44!" id="email" placeholder="name@example.com" type="email" />
      </div>
      <Spacer className="h-16" />

      <Label htmlFor="password">Password</Label>
      <Spacer className="h-4" />
      <div className="relative">
        <LucideLock
          className="text-gray-11 pointer-events-none absolute top-14 left-14"
          size={16}
        />
        <Input className="px-44!" id="password" placeholder="••••••••" type="password" />
        <Button className="group absolute! top-6 right-6" isIconOnly size={32} variant="ghost">
          <LucideEye
            className="text-gray-11 group-hover:text-gray-12 group-active:text-gray-12 transition-colors"
            size={16}
          />
        </Button>
      </div>
      <Spacer className="h-16" />

      <Button iconStart={<LucideLogIn size={16} />} isFullWidth size={44} variant="accent">
        Sign in
      </Button>
      <Spacer className="h-64" />

      <Label htmlFor="disabled">Disabled</Label>
      <Spacer className="h-4" />
      <div className="relative">
        <LucideBan className="text-gray-11 pointer-events-none absolute top-14 left-14" size={16} />
        <Input className="pl-44!" id="disabled" isDisabled placeholder="Disabled" type="url" />
      </div>
      <Spacer className="h-64" />

      <Label htmlFor="read-only">Read Only</Label>
      <Spacer className="h-4" />
      <div className="relative">
        <Input
          className="pr-44!"
          defaultValue="This is a read-only input"
          id="read-only"
          isReadOnly
          type="text"
        />
        <Button className="group absolute! top-6 right-6" isIconOnly size={32} variant="ghost">
          <LucideCopy
            className="text-gray-11 group-hover:text-gray-12 group-active:text-gray-12 transition-colors"
            size={16}
          />
        </Button>
      </div>
      <Spacer className="h-64" />

      <Label htmlFor="input-with-end-icon-button">Input with end icon button</Label>
      <Spacer className="h-4" />
      <div className="flex">
        <Input
          className="rounded-r-none! hover:z-10 focus-visible:z-20"
          id="input-with-end-icon-button"
          placeholder="Download"
          type="url"
        />
        <Button
          className="group -ml-px rounded-l-none! hover:z-10 focus-visible:z-20"
          isIconOnly
          size={44}
          variant="secondary"
        >
          <LucideDownload
            className="text-gray-11 group-hover:text-gray-12 group-active:text-gray-12 transition-colors"
            size={16}
          />
        </Button>
      </div>
      <Spacer className="h-64" />

      <Label htmlFor="active">Active</Label>
      <Spacer className="h-4" />
      <Input id="active" isActive placeholder="Active" type="url" />
      <Spacer className="h-64" />

      <Label htmlFor="valid">Valid</Label>
      <Spacer className="h-4" />
      <Input id="valid" isValid placeholder="Valid" type="url" />
      <Spacer className="h-64" />

      <Label htmlFor="invalid">Invalid</Label>
      <Spacer className="h-4" />
      <Input id="invalid" isInvalid placeholder="Invalid" type="url" />
    </div>
  )
}
