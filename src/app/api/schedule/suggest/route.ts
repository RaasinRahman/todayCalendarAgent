import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getScheduleSuggestions } from "@/lib/claude-api";
import { authOptions } from "../../auth/[...nextauth]/route";
import { google } from "googleapis";

const scheduleRequestSchema = z.object({
  tasks: z.array(
    z.object({
      summary: z.string().min(1, "Task name is required"),
      description: z.string().optional(),
      estimatedDuration: z.number().min(1, "Duration is required"),
    })
  ).min(1, "At least one task is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  preferences: z
    .object({
      dayStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format").optional(),
      dayEndTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format").optional(),
      breakDuration: z.number().min(0).optional(),
      lunchTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format").optional(),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    console.log("Received schedule suggest request");
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.error("No session found");
      return NextResponse.json({ error: "Unauthorized - No session" }, { status: 401 });
    }
    
    if (!session.accessToken) {
      console.error("No access token found in session");
      return NextResponse.json({ error: "Unauthorized - No access token" }, { status: 401 });
    }

    console.log("Session is valid, parsing request body");
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    const result = scheduleRequestSchema.safeParse(body);
    
    if (!result.success) {
      console.error("Invalid input:", result.error.format());
      return NextResponse.json(
        { error: "Invalid input", details: result.error.format() },
        { status: 400 }
      );
    }

    const { tasks, date, preferences } = result.data;
    console.log(`Processing ${tasks.length} tasks for date ${date}`);
    
    // Fetch existing events from Google Calendar for the requested date
    console.log("Fetching existing events from Google Calendar");
    const existingEvents = await getExistingEvents(session.accessToken, date);
    console.log(`Found ${existingEvents.length} existing events`);
    
    // Get schedule suggestions from Claude
    console.log("Requesting schedule suggestions from Claude AI");
    const scheduledTasks = await getScheduleSuggestions({
      tasks,
      date,
      existingEvents,
      preferences,
    });
    
    console.log(`Received ${scheduledTasks.length} scheduled tasks from Claude AI`);

    return NextResponse.json({ 
      success: true, 
      scheduledTasks 
    });
  } catch (error: any) {
    console.error("Error suggesting schedule:", error);
    return NextResponse.json(
      { 
        error: "Failed to suggest schedule",
        message: error.message || "Unknown error",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

async function getExistingEvents(accessToken: string, date: string) {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Set time boundaries for the day
    const timeMin = new Date(`${date}T00:00:00`);
    const timeMax = new Date(`${date}T23:59:59`);
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    
    // Format events to match the expected format
    return events.map((event) => ({
      summary: event.summary || 'Untitled event',
      startTime: event.start?.dateTime || `${date}T00:00:00`,
      endTime: event.end?.dateTime || `${date}T00:00:00`,
    }));
  } catch (error) {
    console.error('Error fetching existing events:', error);
    return [];
  }
}