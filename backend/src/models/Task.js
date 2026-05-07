import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { type: String, required: true },
    inputText: { type: String, required: true },
    operation: { 
        type: String, 
        enum: ['uppercase', 'lowercase', 'reverse', 'word_count'], 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'running', 'success', 'failed'], 
        default: 'pending' 
    },
    result: { type: String, default: null },
    logs: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);