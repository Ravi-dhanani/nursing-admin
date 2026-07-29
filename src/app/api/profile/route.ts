import Parse from "@/app/components/parse";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { mobile, a1_name, a2_email_address, a4_city } = body;

    if (!mobile) {
      return Response.json(
        {
          success: false,
          message: "Mobile number is required",
        },
        { status: 400 },
      );
    }

    const User = Parse.Object.extend("Users");
    const query = new Parse.Query(User);

    query.equalTo("a3_phone_number", mobile);

    const user = await query.first();

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    // Update fields
    if (a1_name !== undefined) {
      user.set("a1_name", a1_name);
    }

    if (a2_email_address !== undefined) {
      user.set("a2_email_address", a2_email_address);
    }

    if (a4_city !== undefined) {
      user.set("a4_city", a4_city);
    }

    const updatedUser = await user.save();

    return Response.json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser.toJSON(),
    });
  } catch (error) {
    console.error("Update User Error:", error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}
