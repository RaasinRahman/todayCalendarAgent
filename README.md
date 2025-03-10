# Today Calendar

A Next.js application that allows you to add tasks to your Google Calendar with ease. Built with Next.js, NextAuth.js, Google Calendar API, and Claude AI for intelligent scheduling.

## Features

- Google OAuth authentication
- Add individual tasks to your Google Calendar
- AI-powered smart scheduling for multiple tasks
- Automatically avoids conflicts with existing calendar events
- Intelligently schedules tasks based on their content and context
- Specify task name, description, date, time, and duration
- Customize scheduling preferences (day start/end times, lunch time, breaks)
- Responsive design with TailwindCSS

## Setup

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account with Google Calendar API enabled
- OAuth 2.0 Client ID and Client Secret from Google Cloud Console
- Anthropic Claude API key

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
CLAUDE_API_KEY=your_claude_api_key
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How It Works

### Single Task Mode

1. Sign in with your Google account
2. Enter task details:
   - Task name
   - Description (optional)
   - Date
   - Start time
   - Duration
3. Click "Add to Calendar"
4. The task will be added to your primary Google Calendar

### Smart Scheduler Mode

1. Sign in with your Google account
2. Add multiple tasks with:
   - Task name
   - Description (optional)
   - Estimated duration
3. Configure scheduling preferences:
   - Date
   - Day start time
   - Day end time
   - Lunch time
   - Break duration
4. Click "Generate Smart Schedule"
5. Review the AI-generated schedule
6. Click "Add to Google Calendar" to add all tasks at once

## How the Smart Scheduler Works

The smart scheduler uses Claude AI to:

1. Analyze your tasks and their descriptions
2. Check your existing calendar events to avoid conflicts
3. Consider your scheduling preferences
4. Intelligently determine the optimal time for each task
5. Group similar tasks together when appropriate
6. Schedule breaks between tasks
7. Place more intensive tasks during peak productivity hours
8. Generate a comprehensive, realistic schedule for your day

## Technologies Used

- Next.js 15
- NextAuth.js for authentication
- Google Calendar API
- Claude AI API for intelligent scheduling
- React Hook Form with Zod validation
- TailwindCSS for styling
- TypeScript for type safety

## License

MIT
