import Parse from "@/app/components/parse";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const phoneNumber = searchParams.get("a3_phone_number");

    if (!phoneNumber) {
      return Response.json(
        { error: "a3_phone_number is required" },
        { status: 400 },
      );
    }

    const User = Parse.Object.extend("Users");
    const userQuery = new Parse.Query(User);

    userQuery.equalTo("a3_phone_number", phoneNumber);

    const user = await userQuery.first();

    if (!user) {
      return Response.json({ error: "No user found" }, { status: 404 });
    }

    return Response.json({
      objectId: user.id,
      a1_name: user.get("a1_name"),
      a2_email: user.get("a2_email") || user.get("a2_email_address"),
      a3_phone_number: user.get("a3_phone_number"),
      a4_city: user.get("a4_city") || user.get("city"),
    });
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
