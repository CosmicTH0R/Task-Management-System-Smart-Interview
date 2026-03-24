import Task from "../models/Task";
import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError";

// Create a new task
export async function createTask(userId: string, data: any) {
  const task = await Task.create({ ...data, user: userId });
  return task;
}

// Get a task by ID with ownership check
export async function getTaskById(userId: string, taskId: string) {
  if (!Types.ObjectId.isValid(taskId)) throw new ApiError(400, "Invalid task ID");
  const task = await Task.findOne({ _id: taskId, user: userId });
  if (!task) throw new ApiError(404, "Task not found");
  return task;
}

// Update a task (ownership enforced)
export async function updateTask(userId: string, taskId: string, data: any) {
  if (!Types.ObjectId.isValid(taskId)) throw new ApiError(400, "Invalid task ID");
  const task = await Task.findOneAndUpdate(
    { _id: taskId, user: userId },
    data,
    { new: true, runValidators: true }
  );
  if (!task) throw new ApiError(404, "Task not found");
  return task;
}

// Delete a task (ownership enforced)
export async function deleteTask(userId: string, taskId: string) {
  if (!Types.ObjectId.isValid(taskId)) throw new ApiError(400, "Invalid task ID");
  const task = await Task.findOneAndDelete({ _id: taskId, user: userId });
  if (!task) throw new ApiError(404, "Task not found");
  return task;
}

// Get all tasks with filtering, search, sort, pagination
export async function getAllTasks(userId: string, query: any) {
  const {
    status,
    priority,
    search,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = query;

  const filter: any = { user: userId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.$text = { $search: search };

  // Sorting
  const sortOptions: any = {};
  const allowedSort = ["dueDate", "createdAt", "priority", "title"];
  if (allowedSort.includes(sortBy)) {
    sortOptions[sortBy] = order === "asc" ? 1 : -1;
  } else {
    sortOptions["createdAt"] = -1;
  }

  // Pagination
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Task.countDocuments(filter);
  const tasks = await Task.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));

  const pages = Math.ceil(total / Number(limit));
  return {
    tasks,
    pagination: {
      total,
      page: Number(page),
      pages,
      limit: Number(limit),
    },
  };
}