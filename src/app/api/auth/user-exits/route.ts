// app/api/auth/check-user/route.ts
import Parse from "@/app/components/parse";

export async function POST(req: Request) {
  try {
    const { mobile } = await req.json();

    if (!mobile) {
      return Response.json(
        { success: false, message: "Mobile number is required" },
        { status: 400 },
      );
    }

    const User = Parse.Object.extend("Users");
    const query = new Parse.Query(User);
    query.equalTo("a3_phone_number", mobile);

    const existingUser = await query.first();

    if (!existingUser) {
      return Response.json({
        success: true,
        exists: false,
        message: "User not found",
        data: null,
      });
    }

    return Response.json({
      success: true,
      exists: true,
      message: "User found",
      data: existingUser.toJSON(),
    });
  } catch (error) {
    console.error("check-user error:", error);
    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
