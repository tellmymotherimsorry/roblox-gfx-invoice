"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Gamepad2, Sun, Move, Swords, Layers, Sparkles, Paintbrush } from "lucide-react"

interface GfxDetailsData {
  rigType: string
  lighting: string
  positioning: string
  weapons: string
  stages: string
  effects: string
  textureFinish: string
}

interface GfxDetailsSectionProps {
  data: GfxDetailsData
  onChange: (data: GfxDetailsData) => void
  errors: Record<string, string>
}

const DEFAULT_PLACEHOLDER = "Default settings"

export function GfxDetailsSection({ data, onChange, errors }: GfxDetailsSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
          <span className="text-xs font-bold">2</span>
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">GFX Specifications</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rig-type" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Gamepad2 className="h-3.5 w-3.5" />
            Rig Type <span className="text-accent">*</span>
          </Label>
          <Select
            value={data.rigType}
            onValueChange={(value) => onChange({ ...data, rigType: value })}
          >
            <SelectTrigger id="rig-type" className={errors.rigType ? "border-destructive" : ""}>
              <SelectValue placeholder="Select rig type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="R6">R6</SelectItem>
              <SelectItem value="R15">R15</SelectItem>
            </SelectContent>
          </Select>
          {errors.rigType && (
            <p className="text-xs text-destructive">{errors.rigType}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="texture-finish" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Paintbrush className="h-3.5 w-3.5" />
            Texture Finish
          </Label>
          <Select
            value={data.textureFinish}
            onValueChange={(value) => onChange({ ...data, textureFinish: value })}
          >
            <SelectTrigger id="texture-finish">
              <SelectValue placeholder="Select finish" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Shiny">Shiny (Recommended)</SelectItem>
              <SelectItem value="Rough">Rough</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lighting" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sun className="h-3.5 w-3.5" />
            Blender Lighting
          </Label>
          <Input
            id="lighting"
            placeholder={DEFAULT_PLACEHOLDER}
            value={data.lighting}
            onChange={(e) => onChange({ ...data, lighting: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="positioning" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Move className="h-3.5 w-3.5" />
            Character Positioning / Pose
          </Label>
          <Input
            id="positioning"
            placeholder={DEFAULT_PLACEHOLDER}
            value={data.positioning}
            onChange={(e) => onChange({ ...data, positioning: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="weapons" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Swords className="h-3.5 w-3.5" />
            Weapons / Tools
          </Label>
          <Textarea
            id="weapons"
            placeholder={`${DEFAULT_PLACEHOLDER} — one per line for multiple tools`}
            value={data.weapons}
            onChange={(e) => onChange({ ...data, weapons: e.target.value })}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">Enter one tool per line; each tool charges separately.</p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="stages" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Layers className="h-3.5 w-3.5" />
            Stages / Podiums
          </Label>
          <Input
            id="stages"
            placeholder={DEFAULT_PLACEHOLDER}
            value={data.stages}
            onChange={(e) => onChange({ ...data, stages: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="effects" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Stroke / Glow / Photoshop Additions
          </Label>
          <Input
            id="effects"
            placeholder={DEFAULT_PLACEHOLDER}
            value={data.effects}
            onChange={(e) => onChange({ ...data, effects: e.target.value })}
          />
        </div>
      </div>
    </section>
  )
}
