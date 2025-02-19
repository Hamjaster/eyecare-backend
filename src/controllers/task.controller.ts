import { Request, Response } from "express";
import Task from "../models/Task";
import Client from "../models/Client";
import User, { UserDocument } from "../models/User";

// Get all tasks for a specific client
export const getTasksByClient = async (req: any, res: any) => {
  try {
    const { clientId } = req.params;
    const user = await User.findById(req.user.id).populate("company") as UserDocument ;
    const client = await Client.findById(clientId)
      .populate({ path: "assignedTo", populate: { path: "company" } });

    if (!client || !user?.company) return res.status(404).json({ error: "Client not found" });
  

    const tasks = await Task.find({ client: clientId, company: user.company._id })
      .populate("assignedTo client");
    res.json({ success: true, message: "Tasks retrieved successfully", data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message, data: null });
  }
};

// Get all tasks for a company
export const getTasksByCompany = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user.id).populate("company") as UserDocument ;


    const tasks = await Task.find({  company: user.company._id })
      .populate("assignedTo client");
    res.json({ success: true, message: "Tasks retrieved successfully", data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message, data: null });
  }
};

// Create a new task
export const createTask = async (req: any, res: any) => {
  try {
    const { assignedTo, client, category, dueDate, notes } = req.body;
    const user = await User.findById(req.user._id).populate("company");
    const clientDoc = await Client.findById(client)
      .populate({ path: "assignedTo", populate: { path: "company" } });

    if (!clientDoc || !user?.company) return res.status(404).json({ error: "Client not found" });
    console.log(clientDoc.assignedTo.company.toString(),user.company._id.toString(), 'testing!')
    if (clientDoc.assignedTo.company._id.toString() !== user.company._id.toString()) {
      return res.status(403).json({ error: "Client not in your company" });
    }

    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || assignedUser.company.toString() !== user.company._id.toString()) {
      return res.status(403).json({ error: "Invalid assignee" });
    }

    const task = new Task({ company: user.company._id, assignedTo, client, category, dueDate, notes });
    await task.populate('assignedTo client')
    await task.save();
    res.status(201).json({ success: true, message: "Task created successfully", data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message, data: null });
  }
};

// Delete a task
export const deleteTask = async (req: any, res: any) => {
  try {
    const { taskId } = req.params;
    const user = await User.findById(req.user.id).populate("company");
    const task = await Task.findById(taskId);

    if (!task || !user?.company) return res.status(404).json({ error: "Task not found" });
    if (task.company.toString() !== user.company._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await task.deleteOne();
    res.json({ success: true, message: "Task deleted successfully", data: null });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message, data: null });
  }
};