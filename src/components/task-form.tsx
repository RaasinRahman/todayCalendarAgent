"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormValues, taskFormSchema } from "@/lib/form-schema";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useSession } from "next-auth/react";

export default function TaskForm() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      summary: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "",
      duration: 30,
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    if (!session) {
      setError("You must be signed in to add tasks to your calendar");
      return;
    }

    if (!session.accessToken) {
      setError("No access token found. Please sign out and sign in again.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Create ISO datetime strings for the API
      const startDateTime = new Date(`${data.date}T${data.startTime}`);
      
      // Validate the date is valid
      if (isNaN(startDateTime.getTime())) {
        throw new Error("Invalid date or time format");
      }
      
      const endDateTime = new Date(startDateTime.getTime() + data.duration * 60000);

      console.log("Submitting event:", {
        summary: data.summary,
        date: data.date,
        startTime: data.startTime,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
      });

      const response = await fetch("/api/calendar/add-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: data.summary,
          description: data.description,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Error response:", result);
        throw new Error(
          result.message || result.error || "Failed to add task to calendar"
        );
      }

      setSuccess(true);
      reset({
        ...data,
        summary: "",
        description: "",
        startTime: "",
      });
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-indigo-700 mb-1">
            Task Name
          </label>
          <Input
            id="summary"
            {...register("summary")}
            placeholder="Enter task name"
            error={errors.summary?.message}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-indigo-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 transition-all duration-200 ease-in-out"
            rows={3}
            placeholder="Enter task description"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-indigo-700 mb-1">
              Date
            </label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              error={errors.date?.message}
            />
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-indigo-700 mb-1">
              Start Time
            </label>
            <Input
              id="startTime"
              type="time"
              {...register("startTime")}
              error={errors.startTime?.message}
            />
          </div>
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-indigo-700 mb-1">
            Duration (minutes)
          </label>
          <select
            id="duration"
            {...register("duration", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 transition-all duration-200 ease-in-out"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
          {errors.duration?.message && (
            <p className="mt-1 text-sm text-red-600 font-medium">{errors.duration.message}</p>
          )}
        </div>

        {error && (
          <div className="p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm">
            Task added to your calendar successfully!
          </div>
        )}

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={!session}
          className="w-full"
        >
          Add to Calendar
        </Button>

        {!session && (
          <p className="text-sm text-center text-indigo-600 mt-2">
            You need to sign in to add tasks to your calendar.
          </p>
        )}
      </form>
    </div>
  );
}