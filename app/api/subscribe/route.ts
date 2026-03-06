import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Build success URL with a refresh hint so the client reloads entitlements
    const successUrl = new URL(baseUrl);
    successUrl.searchParams.set("refresh", "entitlements");

    // Instantly return the success URL, bypassing Stripe Checkout
    return NextResponse.json({ url: successUrl.toString() });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";
    console.error(errorMessage, error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
