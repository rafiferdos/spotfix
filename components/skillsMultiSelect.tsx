"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { X } from "lucide-react"

interface SkillsMultiSelectProps {
  options: string[]
  selected: string[]
  onChange: (skills: string[]) => void
}

export function SkillsMultiSelect({
  options,
  selected,
  onChange,
}: SkillsMultiSelectProps) {
  const toggleSkill = (skill: string, checked: boolean) => {
    onChange(
      checked ? [...selected, skill] : selected.filter((s) => s !== skill)
    )
  }

  const triggerLabel =
    selected.length === 0
      ? "All skills"
      : selected.length === 1
        ? selected[0]
        : `${selected.length} skills selected`

  return (
    <div className="grid gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="w-full justify-between font-normal"
              disabled={options.length === 0}
            />
          }
        >
          <span className="truncate">{triggerLabel}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-72 w-(--anchor-width) overflow-y-auto">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Filter by skill</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {options.map((skill) => (
              <DropdownMenuCheckboxItem
                key={skill}
                checked={selected.includes(skill)}
                onCheckedChange={(checked) => toggleSkill(skill, !!checked)}
                onSelect={(e) => e.preventDefault()}
              >
                {skill}
              </DropdownMenuCheckboxItem>
            ))}
            {options.length === 0 && (
              <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                No skills available yet
              </p>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1 rounded-full bg-secondary py-0.5 pr-1 pl-2.5 text-xs text-secondary-foreground"
            >
              {skill}
              <button
                type="button"
                onClick={() => toggleSkill(skill, false)}
                className="rounded-full p-0.5 hover:bg-foreground/10"
                aria-label={`Remove ${skill} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
