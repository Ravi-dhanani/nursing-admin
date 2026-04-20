import Parse from "@/app/components/parse";

export async function POST(req: Request) {
  try {
    const { objectId, visitorId } = await req.json();

    const User = Parse.Object.extend("Users");
    const query = new Parse.Query(User);

    const user = await query.get(objectId);

    user.set("a10_web_id", visitorId);

    await user.save();

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, message: "Update failed" },
      { status: 500 },
    );
  }
}
