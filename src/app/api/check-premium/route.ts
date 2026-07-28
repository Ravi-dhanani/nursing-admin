import Parse from "@/app/components/parse";

export async function POST(req: Request) {
  try {
    const { mobileNumber, course_iap_id } = await req.json();

    const result = await Parse.Cloud.run("checkPremiumAccessNew", {
      data: {
        mobileNumber,
        iapId: course_iap_id,
      },
    });

    return Response.json({
      success: true,
      ...result,
    });
  } catch (e: any) {
    return Response.json(
      {
        success: false,
        message: e.message,
      },
      { status: 500 },
    );
  }
}
