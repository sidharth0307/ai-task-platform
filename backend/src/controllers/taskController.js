import Task from '../models/Task.js';
import { redisClient } from '../index.js'; // Import the shared connection

export const createTask = async (req, res) => {
    try {
        const { title, inputText, operation } = req.body;
        const userId = req.user.id; // Comes from our auth middleware

        // 1. Create task in DB
        const newTask = await Task.create({
            user: userId,
            title,
            inputText,
            operation,
            status: 'pending' // Initial status
        });

        // 2. Push job to Redis queue
        const jobPayload = JSON.stringify({
            taskId: newTask._id,
            inputText,
            operation
        });
        
        await redisClient.rpush('task_queue', jobPayload);

        res.status(201).json({ message: 'Task queued', task: newTask });
    } catch (error) {
        res.status(500).json({ error: 'Failed to queue task' });
    }
};

export const getMyTasks = async (req, res) => {
    try {
        // Fetch tasks only for the logged-in user, sorted newest first
        const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};