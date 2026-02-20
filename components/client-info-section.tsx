"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, MessageSquare, Mail } from "lucide-react"

interface ClientInfoData {
  robloxUsername: string
  discordUsername: string
  email: string
}

interface ClientInfoSectionProps {
  data: ClientInfoData
  onChange: (data: ClientInfoData) => void
  errors: Record<string, string>
}

export function ClientInfoSection({ data, onChange, errors }: ClientInfoSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
          <span className="text-xs font-bold">1</span>
        </div>
        <h2 className="text-sm font-semibold uppercase tracking-widest text-foreground">Client Information</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="roblox-username" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            Roblox Username <span className="text-accent">*</span>
          </Label>
          <Input
            id="roblox-username"
            placeholder="e.g. builderman"
            value={data.robloxUsername}
            onChange={(e) => onChange({ ...data, robloxUsername: e.target.value })}
            className={errors.robloxUsername ? "border-destructive" : ""}
          />
          {errors.robloxUsername && (
            <p className="text-xs text-destructive">{errors.robloxUsername}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="discord-username" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            Discord Username <span className="text-accent">*</span>
          </Label>
          <Input
            id="discord-username"
            placeholder="e.g. user#1234"
            value={data.discordUsername}
            onChange={(e) => onChange({ ...data, discordUsername: e.target.value })}
            className={errors.discordUsername ? "border-destructive" : ""}
          />
          {errors.discordUsername && (
            <p className="text-xs text-destructive">{errors.discordUsername}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label htmlFor="email" className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            Email <span className="text-muted-foreground/60">(optional)</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. user@email.com"
            value={data.email}
            onChange={(e) => onChange({ ...data, email: e.target.value })}
          />
        </div>
      </div>
    </section>
  )
}
