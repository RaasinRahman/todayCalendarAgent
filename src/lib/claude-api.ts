interface ScheduleSuggestionRequest {
  tasks: {
    summary: string;
    description?: string;
    estimatedDuration: number; // in minutes
  }[];
  date: string; // YYYY-MM-DD
  existingEvents?: {
    summary: string;
    startTime: string;
    endTime: string;
  }[];
  preferences?: {
    dayStartTime?: string; // HH:MM format
    dayEndTime?: string; // HH:MM format
    breakDuration?: number; // minutes
    lunchTime?: string; // HH:MM format
  };
}

interface ScheduledTask {
  summary: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  note?: string;
}

export async function getScheduleSuggestions(
  request: ScheduleSuggestionRequest
): Promise<ScheduledTask[]> {
  console.log("Starting schedule suggestion process");
  
  try {
    // For now, we'll just use the mock scheduler since the Anthropic API integration
    // requires more configuration. In a production environment, you would 
    // properly implement the Anthropic API call.
    console.log("Using mock schedule generator");
    return generateMockSchedule(request);
  } catch (error) {
    console.error("Error in schedule generation:", error);
    return generateMockSchedule(request);
  }
}

// Fallback function to generate a mock schedule if Claude API fails
function generateMockSchedule(request: ScheduleSuggestionRequest): ScheduledTask[] {
  const { tasks, date, preferences } = request;
  
  // Parse user preferences
  const dayStartTime = preferences?.dayStartTime || '09:00';
  const dayEndTime = preferences?.dayEndTime || '17:00';
  const breakDuration = preferences?.breakDuration || 15;
  
  // Convert string times to Date objects
  const startDate = new Date(`${date}T${dayStartTime}`);
  const endDate = new Date(`${date}T${dayEndTime}`);
  
  const scheduledTasks: ScheduledTask[] = [];
  let currentTime = new Date(startDate);
  
  // Create a simple schedule with tasks in sequence and breaks in between
  tasks.forEach((task, index) => {
    // Skip if we're already past the end time
    if (currentTime >= endDate) return;
    
    // Calculate end time for this task
    const taskEndTime = new Date(currentTime.getTime() + task.estimatedDuration * 60000);
    
    // Ensure we don't go past the end of the day
    if (taskEndTime > endDate) {
      // If the task would go past end time, don't schedule it
      return;
    }
    
    // Create the scheduled task
    scheduledTasks.push({
      summary: task.summary,
      description: task.description,
      startTime: currentTime.toISOString(),
      endTime: taskEndTime.toISOString(),
      note: `Automatically scheduled task ${index + 1}`
    });
    
    // Move currentTime to the end of this task plus break
    currentTime = new Date(taskEndTime.getTime() + (index < tasks.length - 1 ? breakDuration * 60000 : 0));
  });
  
  return scheduledTasks;
}