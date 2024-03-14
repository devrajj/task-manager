import express from "express";
import * as taskManager from "./controllers/taskManager/task";
import { authenticateApiKey } from "../routes/middleware/auth";

const router = express.Router();

router.get("/healthz", (_req, res) => res.json({ status: "success" }));

// Create a task
router.post("/tasks", authenticateApiKey, taskManager.createTask);

// Update a task
router.put("/tasks/:id", authenticateApiKey, taskManager.updateTask);

// Delete a task
router.delete("/tasks/:id", authenticateApiKey, taskManager.deleteTask);

// Fetch All Task
router.get("/tasks", authenticateApiKey, taskManager.getTaskList);

// Get Task Detail
router.get("/tasks/:id", authenticateApiKey, taskManager.getTaskDetail);

export default router;
