import { Router } from "express";
import * as taskController from "../controllers/task.controller";
import { validate } from "../middleware/validate";
import { protect } from "../middleware/auth";
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from "../validators/task.validator";

const router = Router();

// All routes require authentication
router.use(protect);

// Create Task
router.post("/", validate(createTaskSchema), taskController.createTask);

// Get All Tasks (with query params validation)
router.get("/", validate(taskQuerySchema, "query"), taskController.getAllTasks);

// Get Task By ID
router.get("/:id", taskController.getTaskById);

// Update Task
router.put("/:id", validate(updateTaskSchema), taskController.updateTask);

// Update Task Status (PATCH)
router.patch("/:id/status", validate(updateTaskSchema), taskController.updateTaskStatus);

// Delete Task
router.delete("/:id", taskController.deleteTask);

export default router;