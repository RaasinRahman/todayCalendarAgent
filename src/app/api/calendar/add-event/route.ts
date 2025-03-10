import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { addEventToGoogleCalendar } from "@/lib/google-calendar";
import { authOptions } from "../../auth/[...nextauth]/route";

const eventSchema = z.object({
  summary: z.string().min(1, "Task name is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    if (!session.accessToken) {
      return NextResponse.json({ error: "No access token found in session" }, { status: 401 });
    }

    const body = await request.json();
    const result = eventSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { summary, startTime, endTime, description } = result.data;
    
    try {
      const event = await addEventToGoogleCalendar(
        session.accessToken,
        summary,
        startTime,
        endTime,
        description
      );

      return NextResponse.json({ success: true, event });
    } catch (calendarError: any) {
      console.error("Google Calendar API error:", calendarError);
      
      // Return detailed error info
      return NextResponse.json({
        error: "Failed to add event to calendar",
        message: calendarError.message || "Unknown calendar error",
        code: calendarError.code || "UNKNOWN_ERROR",
        status: calendarError.response?.status || 500
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error in API route:", error);
    return NextResponse.json({
      error: "Failed to add event to calendar",
      message: error.message || "Unknown error"
    }, { status: 500 });
  }
}