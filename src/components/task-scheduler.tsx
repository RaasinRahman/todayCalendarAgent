"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { MultiTaskItem, ScheduledTask } from "@/lib/form-schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import TaskItem from "./task-item";
import TaskScheduleView from "./task-schedule-view";

export default function TaskScheduler() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<MultiTaskItem[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [schedulingStep, setSchedulingStep] = useState<'input' | 'review' | 'complete'>('input');

  // Initialize form with default preferences
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      // Use a more permissive schema for the form
      z.object({
        date: z.string(),
        preferences: z.object({
          dayStartTime: z.string(),
          dayEndTime: z.string(),
          breakDuration: z.number().or(z.string().transform(val => parseInt(val, 10))),
          lunchTime: z.string(),
        }),
      })
    ),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      preferences: {
        dayStartTime: "09:00",
        dayEndTime: "17:00",
        breakDuration: 15,
        lunchTime: "12:00",
      },
    },
  });

  const addTask = () => {
    if (!newTaskName.trim()) return;

    const newTask: MultiTaskItem = {
      id: uuidv4(),
      summary: newTaskName.trim(),
      description: "",
      estimatedDuration: 30,
    };

    setTasks([...tasks, newTask]);
    setNewTaskName("");
  };

  const updateTask = (updatedTask: MultiTaskItem) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const onSubmit = async (data: any) => {
    if (!session) {
      setError("You must be signed in to schedule tasks");
      return;
    }

    if (tasks.length === 0) {
      setError("You need to add at least one task");
      return;
    }

    setError(null);
    setIsScheduling(true);
    console.log("Starting scheduling process with data:", data);
    console.log("Tasks:", tasks);

    try {
      // Merge tasks with form data
      const formData = {
        ...data,
        tasks,
      };

      console.log("Sending request to API:", formData);

      // Get schedule suggestions from Claude
      const response = await fetch("/api/schedule/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("API response status:", response.status);
      const result = await response.json();
      console.log("API response body:", result);

      if (!response.ok) {
        console.error("API error:", result);
        throw new Error(result.message || result.error || "Failed to get schedule suggestions");
      }

      setScheduledTasks(result.scheduledTasks);
      setSchedulingStep('review');
    } catch (err) {
      console.error("Error in onSubmit:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsScheduling(false);
    }
  };

  const confirmSchedule = async () => {
    if (!session) {
      setError("You must be signed in to add tasks to your calendar");
      return;
    }

    setIsScheduling(true);
    setError(null);

    try {
      // Format events for the calendar API
      const events = scheduledTasks.map(task => ({
        summary: task.summary,
        description: task.description || task.note || "",
        startTime: task.startTime,
        endTime: task.endTime,
      }));

      // Add events to Google Calendar
      const response = await fetch("/api/calendar/add-multiple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ events }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add tasks to calendar");
      }

      setSuccess(true);
      setSchedulingStep('complete');
      // Clear tasks after successful scheduling
      setTasks([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsScheduling(false);
    }
  };

  const startOver = () => {
    setScheduledTasks([]);
    setSchedulingStep('input');
    setSuccess(false);
    setError(null);
  };

  return (
    <div className="w-full">
      {schedulingStep === 'input' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Add Your Tasks</h2>
            
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <Input
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  placeholder="Enter task name"
                  onKeyDown={(e) => e.key === 'Enter' && addTask()}
                  className="flex-1"
                />
                <Button onClick={addTask}>Add Task</Button>
              </div>
              
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No tasks added yet. Add some tasks to get started.
                  </p>
                ) : (
                  tasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Schedule Preferences</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <Input
                  type="date"
                  {...register("date")}
                  error={errors.date?.message as string}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day Start Time
                  </label>
                  <Input
                    type="time"
                    {...register("preferences.dayStartTime")}
                    error={errors.preferences?.dayStartTime?.message as string}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Day End Time
                  </label>
                  <Input
                    type="time"
                    {...register("preferences.dayEndTime")}
                    error={errors.preferences?.dayEndTime?.message as string}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lunch Time
                  </label>
                  <Input
                    type="time"
                    {...register("preferences.lunchTime")}
                    error={errors.preferences?.lunchTime?.message as string}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Break Duration (minutes)
                  </label>
                  <select
                    {...register("preferences.breakDuration", { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
                  {errors.preferences?.breakDuration && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferences.breakDuration.message as string}</p>
                  )}
                </div>
              </div>
              
              {error && (
                <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <Button
                type="submit"
                isLoading={isScheduling}
                disabled={!session || tasks.length === 0}
                className="w-full"
              >
                Generate Smart Schedule
              </Button>
              
              {!session && (
                <p className="text-sm text-center text-gray-500">
                  You need to sign in to schedule tasks.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
      
      {schedulingStep === 'review' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Review Your Schedule</h2>
          
          <TaskScheduleView 
            scheduledTasks={scheduledTasks} 
          />
          
          {error && (
            <div className="p-3 mt-4 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex gap-3 mt-6">
            <Button
              onClick={confirmSchedule}
              isLoading={isScheduling}
              className="flex-1"
            >
              Add to Google Calendar
            </Button>
            <Button
              variant="outline"
              onClick={startOver}
              disabled={isScheduling}
            >
              Go Back
            </Button>
          </div>
        </div>
      )}
      
      {schedulingStep === 'complete' && success && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="my-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">All Set!</h2>
            <p className="text-gray-600 mb-6">
              Your schedule has been added to your Google Calendar.
            </p>
            
            <Button
              onClick={startOver}
              className="px-6"
            >
              Schedule More Tasks
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}