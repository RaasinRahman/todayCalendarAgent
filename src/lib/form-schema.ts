import { z } from "zod";

// Schema for a single task (used in the original form)
export const taskFormSchema = z.object({
  summary: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.number().min(1, "Duration is required"),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

// Schema for a task in the multi-task list
export const multiTaskItemSchema = z.object({
  id: z.string(),
  summary: z.string().min(1, "Task name is required"),
  description: z.string().optional().default(""),
  estimatedDuration: z.number().min(1, "Duration is required"),
});

export type MultiTaskItem = z.infer<typeof multiTaskItemSchema>;

// Schema for the multi-task scheduler form
export const schedulerFormSchema = z.object({
  tasks: z.array(multiTaskItemSchema).min(1, "At least one task is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  preferences: z.object({
    dayStartTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
    dayEndTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
    breakDuration: z.number().min(0),
    lunchTime: z.string().regex(/^\d{2}:\d{2}$/, "Time must be in HH:MM format"),
  }),
});

export type SchedulerFormValues = z.infer<typeof schedulerFormSchema>;

// Schema for scheduled tasks returned from Claude API
export const scheduledTaskSchema = z.object({
  summary: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().optional(),
  note: z.string().optional(),
});

export type ScheduledTask = z.infer<typeof scheduledTaskSchema>;