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
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <textarea
            id="description"
            {...register("description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            rows={3}
            placeholder="Enter task description"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
            Start Time
          </label>
          <Input
            id="startTime"
            type="time"
            {...register("startTime")}
            error={errors.startTime?.message}
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
            Duration (minutes)
          </label>
          <select
            id="duration"
            {...register("duration", { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
          {errors.duration?.message && (
            <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-md bg-green-50 text-green-700 text-sm">
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
          <p className="text-sm text-center text-gray-500">
            You need to sign in to add tasks to your calendar.
          </p>
        )}
      </form>
    </div>
  );
}