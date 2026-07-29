import Parse from "@/app/components/parse";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const phoneNumber: string | null = searchParams.get("a3_phone_number");
  if (!phoneNumber) {
    return Response.json(
      { error: "a3_phone_number is required" },
      { status: 400 },
    );
  }

  // Fetch user
  const User = Parse.Object.extend("Users");
  const userQuery = new Parse.Query(User);

  userQuery.equalTo("a3_phone_number", phoneNumber);

  const user = await userQuery.first();

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const userData = {
    objectId: user.id,

    a1_name: user.get("a1_name"),
    a2_email: user.get("a2_email"),
    a3_phone_number: user.get("a3_phone_number"),
    a4_device_id: user.get("a4_device_id"),

    createdAt: user.createdAt?.toISOString(),
    updatedAt: user.updatedAt?.toISOString(),
  };

  return Response.json(userData);
}
