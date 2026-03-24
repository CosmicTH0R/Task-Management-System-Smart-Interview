import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import * as taskService from "../services/task.service";
import { ApiError } from "../utils/ApiError";

// Create Task
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const task = await taskService.createTask(userId, req.body);
  res.status(201).json(new ApiResponse(true, "Task created", task));
});

// Get All Tasks
export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { tasks, pagination } = await taskService.getAllTasks(userId, req.query);
  res.json(new ApiResponse(true, "Tasks fetched", tasks, pagination));
});

// Get Task By ID
export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const taskId = String(req.params.id);
  const task = await taskService.getTaskById(userId, taskId);
  res.json(new ApiResponse(true, "Task fetched", task));
});

// Update Task
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const taskId = String(req.params.id);
  const task = await taskService.updateTask(userId, taskId, req.body);
  res.json(new ApiResponse(true, "Task updated", task));
});

// Update Task Status (PATCH)
export const updateTaskStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const taskId = String(req.params.id);
  const { status } = req.body;
  if (!status) throw new ApiError(400, "Status is required");
  const task = await taskService.updateTask(userId, taskId, { status });
  res.json(new ApiResponse(true, "Task status updated", task));
});

// Delete Task
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const taskId = String(req.params.id);
  await taskService.deleteTask(userId, taskId);
  res.json(new ApiResponse(true, "Task deleted", null));
});