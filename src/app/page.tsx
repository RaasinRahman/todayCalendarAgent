import AuthButton from "@/components/auth-button";
import TaskForm from "@/components/task-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8 pb-8 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Today Calendar</h1>
          <AuthButton />
        </header>
        
        <main>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Task to Calendar</h2>
            <TaskForm />
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-md border border-blue-100">
            <h3 className="text-lg font-medium text-blue-700 mb-2">How it works:</h3>
            <ol className="list-decimal pl-5 text-blue-600 space-y-2">
              <li>Sign in with your Google account</li>
              <li>Enter your task details</li>
              <li>Select date, time and duration</li>
              <li>Click "Add to Calendar" and your task will be added to your Google Calendar</li>
            </ol>
          </div>
        </main>
        
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Today Calendar - Add today's tasks to your Google Calendar</p>
        </footer>
      </div>
    </div>
  );
}
