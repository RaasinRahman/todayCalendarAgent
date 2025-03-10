import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { addEventToGoogleCalendar } from "@/lib/google-calendar";
import { authOptions } from "../../auth/[...nextauth]/route";

const eventsSchema = z.object({
  events: z.array(
    z.object({
      summary: z.string().min(1, "Task name is required"),
      startTime: z.string().min(1, "Start time is required"),
      endTime: z.string().min(1, "End time is required"),
      description: z.string().optional(),
    })
  ).min(1, "At least one event is required"),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const result = eventsSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { events } = result.data;
    
    // Add each event to Google Calendar
    const results = await Promise.allSettled(
      events.map(async (event) => {
        try {
          const result = await addEventToGoogleCalendar(
            session.accessToken!,
            event.summary,
            event.startTime,
            event.endTime,
            event.description
          );
          return { success: true, event: result };
        } catch (error: any) {
          return { 
            success: false, 
            summary: event.summary,
            error: error.message || "Failed to add event" 
          };
        }
      })
    );

    // Count successes and failures
    const successes = results.filter(r => r.status === 'fulfilled' && (r.value as any).success).length;
    const failures = results.filter(r => r.status === 'rejected' || !(r.value as any).success).length;
    
    // If all events failed, return an error
    if (failures === events.length) {
      return NextResponse.json(
        { error: "Failed to add all events to calendar" },
        { status: 500 }
      );
    }
    
    // Otherwise return the results with a success status
    return NextResponse.json({ 
      success: true, 
      results: {
        total: events.length,
        added: successes,
        failed: failures,
        details: results.map(r => 
          r.status === 'fulfilled' ? r.value : { success: false, error: "Promise rejected" }
        )
      }
    });
  } catch (error: any) {
    console.error("Error adding multiple events:", error);
    return NextResponse.json(
      { error: "Failed to add events to calendar", message: error.message },
      { status: 500 }
    );
  }
}