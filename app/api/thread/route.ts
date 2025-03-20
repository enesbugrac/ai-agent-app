import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/threads`;


// Get all threads
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
        "Content-Type": "application/json",
        Authorization: `Bearer ${privyToken.value}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Threads fetch failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Threads API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// Add a new thread
export async function POST(request: Request) {
  try {
    const cookiesStore = await cookies();
    const privyToken = cookiesStore.get("privy-token");

    if (!privyToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body
    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json({ error: "First message is required" }, { status: 400 });
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${privyToken.value}`,
      },
      body: JSON.stringify({
        assistantId: body.assistantId,
        message: body.message.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Chat API failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
