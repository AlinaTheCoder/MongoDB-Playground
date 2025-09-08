import mongoose from "mongoose";
import taskModel from "../models/Task.js";
import userModel from "../models/User.js";

async function viewAllUsers(req, res) {
  try {
    const result = await userModel.find();
    if (result.length === 0) {
      return res.status(404).json({
        message: `No User Found!`,
      });
    }
    return res.json({
      message: `All Users Fetched successfully!`,
      data: result,
    });
  } catch (error) {
    console.log(`Error while Viewing all the users: ${error.message}`);
    res.status(500).json({
      message: `Server Error while Viewing All Users!`,
    });
  }
}
// When a user is deleted, their tasks should also be removed (cascade delete).
async function deleteAUser(req, res) {
  try {
    // find a user by id then delete it ok
    const user_id = req.params.id;

    if (!user_id) {
      return res.status(400).json({
        message: `user id is required to delete a user!`,
      });
    }

    // now check for the valid task id of type ObjectId
    const { ObjectId } = mongoose.Types;
    if (!ObjectId.isValid(user_id)) {
      return res.status(400).json({
        message: `Valid User Id of Type ObjectId is Required`,
      });
    }
    const user = await userModel.findById({ _id: user_id });

    if (!user) {
      return res.status(404).json({
        message: `User not found!`,
      });
    }
    // now delete it
    await user.deleteOne();
    res.json({
      message: `User and it's associated tasks are deleted successfully!`,
    });
  } catch (error) {
    console.log(`Error while Deleting a User: ${error.message}`);
    res.status(500).json({
      message: `Server Error while Deleting a User!`,
    });
  }
}
async function viewAllTasks(req, res) {
  try {
    const { title, status } = req.query;

    // Build query dynamically
    const query = {};

    // i also wants that admin could search with the title and status of the task
    if (title) {
      query.$text = { $search: title };
    }

    if (status) {
      query.status = status;
    }

    const result = await taskModel.find(query);

    if (result.length === 0) {
      return res.status(404).json({
        message: `No tasks found ${title ? ` with title "${title}"` : ""}${
          status ? ` and status "${status}"` : ""
        }!`,
      });
    }

    res.json({
      message: `Tasks fetched successfully ${
        title ? ` with title "${title}"` : ""
      }${status ? ` and status "${status}"` : ""}.`,
      data: result,
    });
  } catch (error) {
    console.log(`Error while viewing all the tasks: ${error.message}`);
    res.status(500).json({
      message: `Server Error while viewing all the tasks!`,
    });
  }
}
async function deleteATask(req, res) {
  try {
    const task_id = req.params.id;

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

    await taskModel.deleteOne({ _id: task_id });

    res.json({
      message: `Task Deleted Successfully ${task_id}!`,
    });
  } catch (error) {
    console.log(`Error while deleting a task: ${error.message}`);
    res.status(500).json({
      message: `Server Error while deleting a task!`,
    });
  }
}

export { viewAllUsers, deleteAUser, viewAllTasks, deleteATask };
