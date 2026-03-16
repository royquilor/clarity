"use client"

import * as React from "react"
import { track } from "@vercel/analytics"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { ChevronDown, Tick01Icon } from "@hugeicons/core-free-icons"

type Model = {
  id: string
  label: string
  description: string
  locked: boolean
}

const MODELS: Model[] = [
  { id: "haiku",  label: "Haiku 4.5",  description: "Fastest for quick answers",          locked: false },
  { id: "sonnet", label: "Sonnet 4.6", description: "Most efficient for everyday tasks",   locked: true  },
  { id: "opus",   label: "Opus 4.6",   description: "Most capable for ambitious work",     locked: true  },
]

const CURRENT_MODEL_ID = "haiku"

export function ModelSelector() {
  const [upgradeModel, setUpgradeModel] = React.useState<Model | null>(null)

  function handleSelect(model: Model) {
    if (!model.locked) return
    track("model_upgrade_click", { model: model.id })
    setUpgradeModel(model)
  }

  return (
    <>
      <DropdownMenu onOpenChange={(open) => { if (open) track("model_selector_opened") }}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-xs h-7 gap-1.5">
            <span className="text-muted-foreground">Model</span>
            Haiku 4.5
            <HugeiconsIcon icon={ChevronDown} size={12} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 p-1">
          {MODELS.map((model) => (
            <DropdownMenuItem
              key={model.id}
              onSelect={() => handleSelect(model)}
              className="flex items-center justify-between gap-3 px-3 py-2.5"
            >
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-sm">{model.label}</span>
                <span className="text-xs text-muted-foreground">{model.description}</span>
              </div>
              {model.id === CURRENT_MODEL_ID && (
                <HugeiconsIcon icon={Tick01Icon} size={14} className="text-foreground shrink-0" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={!!upgradeModel} onOpenChange={(open) => { if (!open) setUpgradeModel(null) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Upgrade to Pro</DialogTitle>
            <DialogDescription className="mt-2">
              Clarity runs on Claude Haiku. Pro models like Sonnet and Opus are coming soon — subscribe for early access.
            </DialogDescription>
          </DialogHeader>

          <Button
            className="w-full"
            asChild
            onClick={() => track("model_upgrade_email_submit", { model: upgradeModel?.id ?? "" })}
          >
            <a
              href={`https://enter404.com?utm_source=clarity&utm_medium=tool&utm_campaign=upgrade_pro`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe at enter404.com
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
