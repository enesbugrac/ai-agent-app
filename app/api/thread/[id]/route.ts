import { NextResponse } from "next/server";
import { fetchWithAuth } from "@/utils/fetch.utilts";
import type { Thread, ThreadMessage } from "@/types/thread.types";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/threads`;

// Get a thread by id
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const data = await fetchWithAuth<Thread>(`${API_URL}/${id}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Thread API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Add a message to a thread
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate request body
    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const data = await fetchWithAuth<ThreadMessage>(`${API_URL}/${id}/message`, {
      method: "POST",
      body: JSON.stringify({
        content: body.content.trim(),
      }),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Thread API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
