import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';

dotenv.config();

const app = express();

// --- SECURITY MIDDLEWARES ---
// Helmet secures HTTP headers 
app.use(helmet()); 
app.use(cors());
app.use(express.json());

// Rate Limiting: Max 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// --- DATABASE & QUEUE CONNECTIONS ---
// 1. Connect to Redis
export const redisClient = new Redis(process.env.REDIS_URL);
redisClient.on('connect', () => console.log(' Redis Queue connected'));
redisClient.on('error', (err) => console.error(' Redis error:', err));

// 2. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error(' MongoDB connection error:', err));

// --- ROUTES (Placeholder) ---
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'API is running, secure, and ready.' });
});

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// --- ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});