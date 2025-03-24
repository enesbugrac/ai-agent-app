import { NextResponse } from "next/server";
import { fetchWithAuth } from "@/utils/fetch.utilts";
import type { Thread } from "@/types/thread.types";

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

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await fetchWithAuth(`${API_URL}/${id}/messages/stream`, {
      method: "POST",
      isStream: true,
      body: JSON.stringify({
        content: body.content.trim(),
      }),
    });

    return response;
  } catch (error) {
    console.error("Thread API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
