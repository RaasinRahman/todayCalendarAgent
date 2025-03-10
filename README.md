# Today Calendar

A Next.js application that allows you to add tasks to your Google Calendar with ease. Built with Next.js, NextAuth.js, and Google Calendar API.

## Features

- Google OAuth authentication
- Add tasks to your Google Calendar
- Specify task name, description, date, time, and duration
- Responsive design with TailwindCSS

## Setup

### Prerequisites

- Node.js 18+ and npm
- Google Cloud Platform account with Google Calendar API enabled
- OAuth 2.0 Client ID and Client Secret from Google Cloud Console

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
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

1. Sign in with your Google account
2. Enter task details:
   - Task name
   - Description (optional)
   - Date
   - Start time
   - Duration
3. Click "Add to Calendar"
4. The task will be added to your primary Google Calendar

## Technologies Used

- Next.js 15
- NextAuth.js for authentication
- Google Calendar API
- React Hook Form with Zod validation
- TailwindCSS for styling

## License

MIT
