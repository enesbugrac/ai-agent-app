import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = "http://localhost:4000/api/chat/thread";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookiesStore = await cookies();
    const privyToken = cookiesStore.get("privy-token");

    if (!privyToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${privyToken.value}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Thread fetch failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Thread API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const cookiesStore = await cookies();
    const privyToken = cookiesStore.get("privy-token");

    if (!privyToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validate request body
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/${id}/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${privyToken.value}`,
      },
      body: JSON.stringify({
        content: body.content.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Message send failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Thread API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
