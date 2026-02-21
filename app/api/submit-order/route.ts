import { NextResponse, type NextRequest } from "next/server"
import { isRateLimited } from "@/lib/rate-limit"

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

interface OrderPayload {
  invoiceNumber: string
  client: {
    robloxUsername: string
    discordUsername: string
    email: string
  }
  gfx: {
    rigType: string
    lighting: string
    positioning: string
    weapons: string
    stages: string
    effects: string
    textureFinish: string
  }
  total: number
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      request.ip ||
      "unknown"

    // Check rate limit: 3 requests per 5 minutes
    if (isRateLimited(ip)) {
      return NextResponse.redirect(
        "https://v0-rate-limited-ip-website-jj00q41as-dds-projects-4f9c1417.vercel.app/",
        { status: 307 }
      )
    }

    const body: OrderPayload = await request.json()

    // Validate required fields
    if (!body.client?.robloxUsername || !body.client?.discordUsername) {
      return NextResponse.json(
        { error: "Roblox Username and Discord Username are required." },
        { status: 400 }
      )
    }

    if (!body.gfx?.rigType) {
      return NextResponse.json(
        { error: "Rig type selection is required." },
        { status: 400 }
      )
    }

    const defaultText = "Default settings (no additional charges)"
    const timestamp = new Date().toISOString()

    // Format amounts as whole Robux, with grouping separators when >= 1000
    const formatRobux = (amount: number | undefined | null) => {
      const n = Math.round(amount || 0)
      return n.toLocaleString("en-US")
    }

    const embed = {
      title: `New GFX Commission Order`,
      color: 0xe74c3c,
      fields: [
        {
          name: "Invoice Number",
          value: `\`${body.invoiceNumber}\``,
          inline: true,
        },
        {
          name: "Total",
          value: `\`${formatRobux(body.total)} robux\``,
          inline: true,
        },
        {
          name: "\u200b",
          value: "**--- Client Information ---**",
          inline: false,
        },
        {
          name: "Roblox Username",
          value: body.client.robloxUsername,
          inline: true,
        },
        {
          name: "Discord Username",
          value: body.client.discordUsername,
          inline: true,
        },
        {
          name: "Email",
          value: body.client.email || "Not provided",
          inline: true,
        },
        {
          name: "\u200b",
          value: "**--- GFX Specifications ---**",
          inline: false,
        },
        {
          name: "Rig Type",
          value: body.gfx.rigType,
          inline: true,
        },
        {
          name: "Texture Finish",
          value: body.gfx.textureFinish || "Shiny",
          inline: true,
        },
        {
          name: "Blender Lighting",
          value: body.gfx.lighting || defaultText,
          inline: false,
        },
        {
          name: "Character Positioning / Pose",
          value: body.gfx.positioning || defaultText,
          inline: false,
        },
        {
          name: "Weapons / Tools",
          value: body.gfx.weapons || defaultText,
          inline: false,
        },
        {
          name: "Stages / Podiums",
          value: body.gfx.stages || defaultText,
          inline: false,
        },
        {
          name: "Stroke / Glow / PS Effects",
          value: body.gfx.effects || defaultText,
          inline: false,
        },
      ],
      footer: {
        text: "GFX Studio - Roblox Commission Invoice",
      },
      timestamp,
    }

    // Include full order JSON in the webhook content (truncated if too long)
    const rawJson = JSON.stringify(body, null, 2)
    let rawForContent = rawJson
    if (rawForContent.length > 1900) {
      rawForContent = rawForContent.slice(0, 1900) + "\n... (truncated)"
    }
    const content = `\n\`\`\`json\n${rawForContent}\n\`\`\`\n`

    if (DISCORD_WEBHOOK_URL) {
      const webhookResponse = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "GFX Studio",
          content,
          embeds: [embed],
        }),
      })

      if (!webhookResponse.ok) {
        console.error("Discord webhook failed:", webhookResponse.status)
        return NextResponse.json(
          { error: "Failed to send order notification." },
          { status: 500 }
        )
      }
    } else {
      // Log to console when no webhook URL is configured
      console.log("Order received (no webhook configured):", JSON.stringify(embed, null, 2))
    }

    return NextResponse.json({
      success: true,
      message: "Order submitted successfully.",
      invoiceNumber: body.invoiceNumber,
    })
  } catch (error) {
    console.error("Error processing order:", error)
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    )
  }
}
