import { stat } from "fs";
import taskModel from "../models/Task.js";
import mongoose from "mongoose";
import validator from "validator";

async function createTask(req, res) {
  try {
    // console.log(`I'm inside the create task function!`);

    const { title, description, status, dueDate } = req.body;
    const user_id = req.user.user_id;
    if (!user_id) {
      return res.status(400).json({
        message: `Owner is required for creating a task`,
      });
    }
    if (!title) {
      return res.status(400).json({
        message: `Title is required for creating a task`,
      });
    }

    if (status === "completed") {
      return res.status(400).json({
        message: `While Creating the Task status could not be completed`,
      });
    }
    // check if the due date is in the past
    const today = new Date();
    if (dueDate && dueDate < today) {
      return res.status(400).json({
        message: `Due Date of the Task could not be in the past!`,
      });
    }

    const result = await taskModel.create({
      title,
      description,
      status,
      dueDate,
      owner: user_id,
    });

    res.status(201).json({
      message: `task created successfully with id: ${result._id}`,
    });
  } catch (error) {
    console.log(`Error while Creating Task: ${error.message}`);
    return res.status(500).json({
      message: `Server Error`,
    });
  }
}

// req.user.user_id
// now let's try to impliment the search functionality
// search by title of task
async function getAllTasks(req, res) {
  try {
    const user_id = req.user.user_id;
    const { title, status } = req.query;

    // Build query dynamically
    const query = { owner: user_id };

    if (title) {
      query.$text = { $search: title };
    }

    if (status) {
      query.status = status;
    }

    const result = await taskModel.find(query);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No tasks found for the owner ${user_id}${
          title ? ` with title "${title}"` : ""
        }${status ? ` and status "${status}"` : ""}!`,
      });
    }

    res.json({
      message: `Tasks fetched successfully for owner ${user_id}${
        title ? ` with title "${title}"` : ""
      }${status ? ` and status "${status}"` : ""}.`,
      data: { result },
    });
  } catch (error) {
    console.log(`Error while getting all tasks: ${error.message}`);
    return res.status(500).json({
      message: `Server Error`,
    });
  }
}

// CHECK : Only if the task’s owner matches the logged-in user.
async function getTaskById(req, res) {
  try {
    const task_id = req.params.id;
    const user_id = req.user.user_id;
    // if i'll not provide the task id then the get all tasks by owner route will automatically run

    // now check for the valid task id of type ObjectId
    const { ObjectId } = mongoose.Types;
    if (!ObjectId.isValid(task_id)) {
      return res.status(400).json({
        message: `Valid Task Id of Type ObjectId is Required`,
      });
    }
    /* 
  if you only want to get some particular info not the whole document info
  const result = await taskModel.findOne(
      { _id: task_id, owner: user_id },
      "title"
    ); */
    const result = await taskModel.findOne({ _id: task_id, owner: user_id });

    if (!result) {
      return res.status(404).json({
        message: `No Task found for task id ${task_id}!`,
      });
    }

    res.json({
      message: `Task Details Fetched Successfully for the task_id ${task_id}`,
      data: {
        result,
      },
    });
  } catch (error) {
    console.log(`Error while getting a task by id: ${error.message}`);
    return res.status(500).json({
      message: `Server Error`,
    });
  }
}

/* 
Only the owner can update.

Fields allowed: title, description, status, dueDate.
*/
async function updateTaskById(req, res) {
  try {
    const task_id = req.params.id;
    const user_id = req.user.user_id;

    const { title, description, status, dueDate } = req.body;

    if (!task_id) {
      return res.status(400).json({
        message: `Task id is required!`,
      });
    }

    // now check for the valid task id of type ObjectId
    const { ObjectId } = mongoose.Types;
    if (!ObjectId.isValid(task_id)) {
      return res.status(400).json({
        message: `Valid Task Id of Type ObjectId is Required`,
      });
    }

    if (!validator.isISO8601(dueDate)) {
      return res.status(400).json({
        message: "Enter a valid due date format (YYYY-MM-DDTHH:mm:ss.sssZ)",
      });
    }

    await taskModel.updateOne(
      { _id: task_id, owner: user_id },
      { title, description, status, dueDate },
      { runValidators: true }
    );

    res.json({
      message: `Task updated Succesfully of id ${task_id}`,
    });
  } catch (error) {
    console.log(`Error while updating a task by id: ${error.message}`);
    return res.status(500).json({
      message: `Server Error`,
    });
  }
}

// Only the owner can delete.
async function deleteTaskById(req, res) {
  try {
    const task_id = req.params.id;
    const user_id = req.user.user_id;

    if (!task_id) {
      return res.status(400).json({
        message: `Task id is required!`,
      });
    }
    // now check for the valid task id of type ObjectId
    const { ObjectId } = mongoose.Types;
    if (!ObjectId.isValid(task_id)) {
      return res.status(400).json({
        message: `Valid Task Id of Type ObjectId is Required`,
      });
    }

    await taskModel.deleteOne({ _id: task_id, owner: user_id });

    res.json({
      message: `Task Deleted Successfully ${task_id}!`,
    });
  } catch (error) {
    console.log(`Error while updating a task by id: ${error.message}`);
    return res.status(500).json({
      message: `Server Error`,
    });
  }
}

export { createTask, getAllTasks, getTaskById, updateTaskById, deleteTaskById };
