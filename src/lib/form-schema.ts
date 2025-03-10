import { z } from "zod";

export const taskFormSchema = z.object({
  summary: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.number().min(1, "Duration is required"),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;