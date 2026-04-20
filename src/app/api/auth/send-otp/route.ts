export async function POST(req: Request) {
  try {
    const { mobile } = await req.json();

    const formData = new FormData();
    formData.append("PhoneNo", `91${mobile}`);

    const res = await fetch("https://mynursingapp.in/API/SignUpUser.php", {
      method: "POST",
      body: formData,
    });

    const text = await res.text();

    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json({
        success: false,
        message: "Invalid server response",
      });
    }

    const isSuccess =
      data.success === true ||
      data.success === "true" ||
      data.status === true ||
      data.status === "true" ||
      data.status === 1 ||
      data.Status === "1";

    return Response.json({
      success: isSuccess,
      message: data.message || data.Message || "OTP sent",
      data: data.data || data,
    });
  } catch (error) {
    return Response.json({
      success: false,
      message: "Server error",
    });
  }
}
