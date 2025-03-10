"use client";

import { ScheduledTask } from "@/lib/form-schema";

interface TaskScheduleViewProps {
  scheduledTasks: ScheduledTask[];
}

export default function TaskScheduleView({ scheduledTasks }: TaskScheduleViewProps) {
  // Sort tasks by start time
  const sortedTasks = [...scheduledTasks].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  // Format time for display
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format duration for display
  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationInMinutes = Math.round((end.getTime() - start.getTime()) / 60000);
    
    if (durationInMinutes < 60) {
      return `${durationInMinutes} min`;
    } else {
      const hours = Math.floor(durationInMinutes / 60);
      const minutes = durationInMinutes % 60;
      return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
    }
  };

  if (scheduledTasks.length === 0) {
    return (
      <div className="text-center py-10 text-indigo-600 bg-white rounded-lg border border-gray-200 shadow-sm">
        <svg className="w-12 h-12 mx-auto text-indigo-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">No scheduled tasks available.</p>
        <p className="text-sm mt-1">Add tasks to see them in your schedule.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
          <div className="grid grid-cols-12 gap-4 font-medium text-indigo-900">
            <div className="col-span-3">Time</div>
            <div className="col-span-5">Task</div>
            <div className="col-span-2">Duration</div>
            <div className="col-span-2">Notes</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sortedTasks.map((task, index) => (
            <div 
              key={index} 
              className="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
            >
              <div className="col-span-3 text-indigo-700 font-medium">
                {formatTime(task.startTime)} - {formatTime(task.endTime)}
              </div>
              
              <div className="col-span-5">
                <h4 className="font-semibold text-gray-900">{task.summary}</h4>
                {task.description && (
                  <p className="text-sm text-indigo-600 mt-1">{task.description}</p>
                )}
              </div>
              
              <div className="col-span-2 text-sm font-medium text-indigo-700">
                {getDuration(task.startTime, task.endTime)}
              </div>
              
              <div className="col-span-2 text-sm">
                {task.note && (
                  <span className="inline-block bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full text-xs font-medium">
                    {task.note}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}