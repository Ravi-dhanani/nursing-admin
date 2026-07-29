import Parse from "@/app/components/parse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mobileNumber } = body;

    // Validate incoming parameters
    if (!mobileNumber) {
      return NextResponse.json(
        {
          success: false,
          hasAccess: false,
          error: "Mobile number is required",
        },
        { status: 400 },
      );
    }

    const FreeUsers = Parse.Object.extend("FreeUsers");
    const query = new Parse.Query(FreeUsers);

    // Match mobile number
    query.equalTo("mobileNumber", mobileNumber);

    // Fetch matching user payment record
    const userRecord = await query.first();

    if (!userRecord) {
      return NextResponse.json({
        success: true,
        message: "No purchase record found for this mobile number",
      });
    }

    // Check payment status: 1 = Paid / Has Access, 0 = Not Paid
    const paymentStatus = userRecord.get("paymentStatus");
    const hasAccess = Number(paymentStatus) === 1;

    console.log(hasAccess);

    return NextResponse.json({
      success: true,
      hasAccess,
      paymentStatus: Number(paymentStatus),
    });
  } catch (error: any) {
    console.error("Error verifying premium access:", error);
    return NextResponse.json(
      {
        success: false,
        hasAccess: false,
        error: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
