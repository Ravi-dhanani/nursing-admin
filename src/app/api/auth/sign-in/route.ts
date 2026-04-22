import Parse from "@/app/components/parse";

export type UserType = {
  objectId: string;

  a1_name: string;
  a2_email_address: string;
  a3_phone_number: string;
  a4_city: string;

  a9_device_id: string;
  a10_web_id: string;

  b1_device_model: string;
  b2_sdk_api_level: number;
  b3_device_brand: string;
  b4_os_version: string;

  createdAt: string;
  updatedAt: string;
};

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
      const newUser = new User();

      newUser.set("a3_phone_number", mobile);
      newUser.set("a10_web_id", null);

      const savedUser = await newUser.save();

      return Response.json({
        success: true,
        isNewUser: true,
        message: "User created successfully",
        data: savedUser.toJSON(),
      });
    }

    return Response.json({
      success: true,
      isNewUser: false,
      message: "Login successful",
      data: existingUser.toJSON(),
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, message: "Something went wrong" },
      { status: 500 },
    );
  }
}
