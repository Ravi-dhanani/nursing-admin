export async function POST(req: Request) {
  try {
    const { UserId, OTP } = await req.json();

    const res = await fetch("https://mynursingapp.in/API/VerifyOTP.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        UserId: String(UserId),
        OTP: String(OTP),
      }),
    });

    const data = await res.json();

    return Response.json({
      success: data.status,
      message: data.message || data.Message,
      data: data,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Server error. Please try again.",
      data: null,
    });
  }
}
