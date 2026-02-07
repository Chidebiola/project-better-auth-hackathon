import { Dialog } from "@base-ui/react/dialog"
import { Button } from "@nattui/react-components"

export default function DialogPage() {
  return (
    <div className="flex flex-col">
      <Dialog.Root>
        <Dialog.Trigger render={<Button>View notifications</Button>} />
        <Dialog.Portal>
          <Dialog.Backdrop className="bg-gray-12 fixed inset-0 min-h-dvh opacity-20 transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-[-webkit-touch-callout:none]:absolute" />
          <Dialog.Popup className="bg-gray-1 fixed top-1/2 left-1/2 -mt-8 w-full max-w-448 -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 transition-all duration-150 data-ending-style:scale-90 data-ending-style:opacity-0 data-starting-style:scale-90 data-starting-style:opacity-0 dark:outline-gray-300">
            <Dialog.Title className="-mt-1.5 mb-1 text-lg font-medium">Notifications</Dialog.Title>
            <Dialog.Description className="mb-6 text-base text-gray-600">
              You are all caught up. Good job!
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <Dialog.Close render={<Button>Close</Button>} />
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
