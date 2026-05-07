import express from 'express';
import { createTask, getMyTasks } from '../controllers/taskController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// I protect both routes with the verifyToken middleware
router.post('/', verifyToken, createTask);
router.get('/', verifyToken, getMyTasks);

export default router;