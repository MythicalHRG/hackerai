import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/subscription/webhook
 * Stubbed for local open-source bypass.
 * We don't need to process Stripe webhooks to manage rate limit buckets
 * since everyone gets the highest tier automatically locally.
 */
export async function POST(req: NextRequest) {
  // Safely ignore any incoming webhooks and return a 200 OK
  return NextResponse.json({ received: true, bypassed: true });
}
