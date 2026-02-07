import { LucideArrowLeft, LucideArrowRight, LucideDownload } from "@nattui/icons"
import { Button } from "@nattui/react-components"

export default function ButtonPage() {
  return (
    <div className="flex flex-col gap-16">
      <Button className="absolute! top-64 right-64">Absolute</Button>

      <p>Variant</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button variant="accent">Accent</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <p>Size</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button size={32}>Add goal</Button>
        <Button size={36}>Add goal</Button>
        <Button size={40}>Add goal</Button>
        <Button size={44}>Add goal</Button>
        <Button size={48}>Add goal</Button>
      </div>

      <p>Rounded</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button isRounded variant="accent">
          Add goal
        </Button>
        <Button isRounded variant="primary">
          Add goal
        </Button>
        <Button isRounded variant="secondary">
          Add goal
        </Button>
        <Button isRounded variant="ghost">
          Add goal
        </Button>
      </div>

      <p>Disabled</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button isDisabled variant="accent">
          Add goal
        </Button>
        <Button isDisabled variant="primary">
          Add goal
        </Button>
        <Button isDisabled variant="secondary">
          Add goal
        </Button>
        <Button isDisabled variant="ghost">
          Add goal
        </Button>
      </div>

      <p>Loading</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button isLoading variant="accent">
          Add goal
        </Button>
        <Button isLoading variant="primary">
          Add goal
        </Button>
        <Button isLoading variant="secondary">
          Add goal
        </Button>
        <Button isLoading variant="ghost">
          Add goal
        </Button>
      </div>

      <p>Active</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button isActive variant="accent">
          Add goal
        </Button>
        <Button isActive variant="primary">
          Add goal
        </Button>
        <Button isActive variant="secondary">
          Add goal
        </Button>
        <Button isActive variant="ghost">
          Add goal
        </Button>
      </div>

      <p>Icon</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button
          iconEnd={<LucideArrowRight size={16} />}
          iconStart={<LucideArrowLeft size={16} />}
          variant="accent"
        >
          Add goal
        </Button>
        <Button
          iconEnd={<LucideArrowRight size={16} />}
          iconStart={<LucideArrowLeft size={16} />}
          variant="primary"
        >
          Add goal
        </Button>
        <Button
          iconEnd={<LucideArrowRight size={16} />}
          iconStart={<LucideArrowLeft size={16} />}
          variant="secondary"
        >
          Add goal
        </Button>
        <Button
          iconEnd={<LucideArrowRight size={16} />}
          iconStart={<LucideArrowLeft size={16} />}
          variant="ghost"
        >
          Add goal
        </Button>
      </div>

      <p>Full width</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button className="max-w-320" isFullWidth>
          Add goal
        </Button>
      </div>

      <p>Icon only</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button isIconOnly variant="accent">
          <LucideDownload size={16} />
        </Button>
        <Button isIconOnly variant="primary">
          <LucideDownload size={16} />
        </Button>
        <Button isIconOnly variant="secondary">
          <LucideDownload size={16} />
        </Button>
        <Button isIconOnly variant="ghost">
          <LucideDownload size={16} />
        </Button>
      </div>

      <p>Icon only size</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button isIconOnly size={32}>
          <LucideDownload size={16} />
        </Button>
        <Button isIconOnly size={36}>
          <LucideDownload size={16} />
        </Button>
        <Button isIconOnly size={40}>
          <LucideDownload size={16} />
        </Button>
        <Button isIconOnly size={44}>
          <LucideDownload size={18} />
        </Button>
        <Button isIconOnly size={48}>
          <LucideDownload size={18} />
        </Button>
      </div>

      <p>Icon only loading</p>
      <div className="flex flex-wrap items-center gap-16">
        <Button isIconOnly isLoading size={32}>
          <LucideDownload size={16} />
        </Button>
        <Button isIconOnly isLoading size={36}>
          <LucideDownload size={16} />
        </Button>
        <Button isIconOnly isLoading size={40}>
          <LucideDownload size={16} />
        </Button>
        <Button isIconOnly isLoading size={44}>
          <LucideDownload size={18} />
        </Button>
        <Button isIconOnly isLoading size={48}>
          <LucideDownload size={18} />
        </Button>
      </div>
    </div>
  )
}
