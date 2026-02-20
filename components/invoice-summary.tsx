"use client"

import { Separator } from "@/components/ui/separator"

interface InvoiceSummaryProps {
  rigType: string
  textureFinish: string
  hasCustomLighting: boolean
  hasCustomPose: boolean
  weaponsCount: number
  hasStages: boolean
  hasEffects: boolean
}

interface LineItem {
  label: string
  amount: number
}

export function InvoiceSummary({
  rigType,
  textureFinish,
  hasCustomLighting,
  hasCustomPose,
  weaponsCount,
  hasStages,
  hasEffects,
}: InvoiceSummaryProps) {
  const items: LineItem[] = []

  if (rigType) {
    items.push({
      label: `Base GFX Render (${rigType})`,
      amount: rigType === "R15" ? 400.0 : 200.0,
    })
  }

  if (textureFinish === "Shiny") {
    items.push({ label: "Texture: Shiny Finish", amount: 0.0 })
  } else if (textureFinish === "Rough") {
    items.push({ label: "Texture: Rough Finish", amount: 50.0 })
  }

  if (hasCustomLighting) {
    items.push({ label: "Custom Blender Lighting", amount: 50.0 })
  }
  if (hasCustomPose) {
    items.push({ label: "Custom Character Pose", amount: 50.0 })
  }
  if (weaponsCount > 0) {
    items.push({ label: `Weapons / Tools (${weaponsCount})`, amount: weaponsCount * 100.0 })
  }
  if (hasStages) {
    items.push({ label: "Stages / Podiums", amount: 50.0 })
  }
  if (hasEffects) {
    items.push({ label: "Stroke / Glow / PS Effects", amount: 50.0 })
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
          <span className="text-xs font-bold">3</span>
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Order Summary</h2>
      </div>

      <div className="rounded-lg border border-border bg-secondary/50 p-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-widest text-muted-foreground">
            <span>Item</span>
            <span>Amount</span>
          </div>
          <Separator />

          {items.length === 0 ? (
            <p className="py-3 text-center text-sm text-muted-foreground">
              Select a rig type to see pricing
            </p>
          ) : (
            <div className="flex flex-col gap-2 py-1">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="font-mono text-sm text-foreground">
                    {item.amount === 0 ? "FREE" : `${item.amount.toFixed(0)} Robux`}
                  </span>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-semibold text-foreground">Total</span>
            <span className="font-mono text-xl font-bold text-foreground">
              {subtotal.toFixed(0)} Robux
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
