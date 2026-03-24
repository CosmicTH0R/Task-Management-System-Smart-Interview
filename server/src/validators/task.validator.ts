import { z } from "zod";

// Enums for status and priority
export const TaskStatusEnum = z.enum(["Todo", "In Progress", "Done"]);
export const TaskPriorityEnum = z.enum(["Low", "Medium", "High"]);

// Create Task Schema
export const createTaskSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z.string().datetime({ message: "Invalid ISO date" }).optional(),
});

// Update Task Schema (all fields optional)
export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  dueDate: z.string().datetime({ message: "Invalid ISO date" }).optional(),
});

// Query Params Schema
export const taskQuerySchema = z.object({
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  search: z.string().optional(),
  sortBy: z.enum(["dueDate", "createdAt", "priority", "title"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
});