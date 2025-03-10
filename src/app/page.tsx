import AuthButton from "@/components/auth-button";
import TaskForm from "@/components/task-form";
import TaskScheduler from "@/components/task-scheduler";
import { Tabs } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div>
      <div className="flex justify-end mb-6">
        <AuthButton />
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Today Calendar</h2>
        <p className="text-indigo-600">Efficiently manage your daily tasks and schedule them directly to your Google Calendar.</p>
      </div>
      
      <main>
        <Tabs
          items={[
            {
              label: "Single Task",
              content: (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Add Single Task</h2>
                  <p className="text-indigo-600 mb-6">
                    Quickly add a single task to your calendar with a specific date and time.
                  </p>
                  <TaskForm />
                </div>
              )
            },
            {
              label: "Smart Scheduler",
              content: (
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Smart Task Scheduler</h2>
                  <p className="text-indigo-600 mb-6">
                    Add multiple tasks and let our AI intelligently schedule them throughout your day, 
                    avoiding conflicts with existing calendar events.
                  </p>
                  <TaskScheduler />
                </div>
              )
            }
          ]}
        />
        
        <div className="mt-10 p-6 bg-indigo-50 rounded-lg border border-indigo-100">
          <h3 className="text-lg font-semibold text-indigo-800 mb-3">How it works:</h3>
          <ol className="list-decimal pl-5 text-indigo-700 space-y-2">
            <li>Sign in with your Google account</li>
            <li>Choose between adding a single task or using the smart scheduler</li>
            <li>For single tasks: Select date, time and duration</li>
            <li>For multiple tasks: Add all your tasks for the day and our AI will schedule them optimally</li>
            <li>Your tasks will be added to your Google Calendar automatically</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
