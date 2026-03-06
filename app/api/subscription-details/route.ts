import { getUserID } from "@/lib/auth/get-user-id";
import { NextRequest, NextResponse } from "next/server";
import { SubscriptionTier } from "@/types/chat";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json().catch(() => ({}));
    const confirm: boolean = body?.confirm === true;
    const requestedQuantity: number = body?.quantity || 1;
    let targetPlan: string = body?.plan || "ultra";

    // Verify user is logged in
    const userId = await getUserID(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Determine plan type mapping
    let planType: SubscriptionTier = "ultra";
    if (targetPlan.includes("team")) planType = "team";
    else if (targetPlan.includes("pro-plus")) planType = "pro-plus";
    else if (targetPlan.includes("pro")) planType = "pro";

    // If the UI is confirming an upgrade, pretend it worked and return success
    if (confirm) {
      return NextResponse.json({
        success: true,
        message: "Local open-source bypass: Subscription updated successfully",
        subscriptionId: "sub_bypassed_local",
      });
    }

    // If the UI just wants preview details for the pricing screen, return $0 amounts
    const currentSeconds = Math.floor(Date.now() / 1000);
    const oneYearSeconds = 31536000;

    return NextResponse.json({
      proratedAmount: 0,
      proratedCredit: 0,
      totalDue: 0,
      additionalCredit: 0,
      paymentMethod: "Local Bypass",
      currentPlan: planType,
      quantity: requestedQuantity,
      currentPeriodStart: currentSeconds,
      currentPeriodEnd: currentSeconds + oneYearSeconds,
      nextInvoiceDate: currentSeconds + oneYearSeconds,
      nextInvoiceAmount: 0,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    console.error("Error calculating bypass upgrade preview:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
};
