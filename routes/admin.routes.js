import express from "express";
const router = express.Router();
import {
  viewAllUsers,
  deleteAUser,
  viewAllTasks,
  deleteATask,
} from "../controllers/admin.controller.js";

import authMiddleware from "../middlewares/authMiddleware.js";
router.use(authMiddleware);

import authorize_role from "../middlewares/authorize_role.middleware.js";
router.use(authorize_role);

// view all users
router.get("/users", viewAllUsers);

// delete a user
router.delete("/users/:id", deleteAUser);

// View All Tasks
router.get("/tasks", viewAllTasks);

// delete any task
router.delete("/tasks/:id", deleteATask);

export default router;
