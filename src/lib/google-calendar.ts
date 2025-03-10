import { google } from 'googleapis';

export async function addEventToGoogleCalendar(
  accessToken: string,
  summary: string,
  startTime: string,
  endTime: string,
  description?: string
) {
  if (!accessToken) {
    throw new Error('No access token provided');
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Make sure dates are valid ISO strings
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format provided');
    }

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    const event = {
      summary,
      description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone,
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone,
      },
    };

    console.log('Attempting to add event to Google Calendar:', {
      summary,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      timeZone,
    });

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    console.log('Event added successfully:', response.data.htmlLink);
    return response.data;
  } catch (error: any) {
    console.error('Error adding event to Google Calendar:', error);
    
    // Enhanced error logging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    throw error;
  }
}