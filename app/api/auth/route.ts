import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = "http://localhost:4000/api/user/auth";

export async function GET() {
  try {
    const cookiesStore = await cookies();
    const privyToken = cookiesStore.get("privy-token");

    if (!privyToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${privyToken.value}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
