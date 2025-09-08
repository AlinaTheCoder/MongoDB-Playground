import express from "express";
const router = express.Router();
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
} from "../controllers/task.controller.js";

// bcz all task routes require jwt auth so router level middleware
router.use(authMiddleware);

// all task routes here

// create Task
router.post("/", createTask);

// get all the tasks of the logged in user
router.get("/", getAllTasks);

// get Task by task id
router.get("/:id", getTaskById);

// update task
router.put("/:id", updateTaskById);

// delete task
router.delete("/:id", deleteTaskById);

export default router;
