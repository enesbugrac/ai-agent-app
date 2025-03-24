import { NextResponse } from "next/server";
import { fetchWithAuth } from "@/utils/fetch.utilts";
import type { Thread } from "@/types/thread.types"; // assuming you have this type

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/threads`;

// Get all threads
export async function GET() {
  try {
    const data = await fetchWithAuth<Thread[]>(API_URL);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Threads API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Add a new thread
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json({ error: "First message is required" }, { status: 400 });
    }

    const response = await fetchWithAuth(`${API_URL}`, {
      method: "POST",
      isStream: true,
      body: JSON.stringify({
        assistantId: body.assistantId,
        message: body.message.trim(),
      }),
    });

    return response;
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
