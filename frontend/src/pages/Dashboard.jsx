import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllTasks, createNewTask } from '../helpers/taskHelper';
import { logoutUser } from '../helpers/authHelper';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({ title: '', inputText: '', operation: 'uppercase' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const loadTasks = useCallback(async () => {
        try {
            const data = await fetchAllTasks();
            setTasks(data);
        } catch (err) {
            if (err.response?.status === 401) {
                logoutUser();
                navigate('/');
            }
        }
    }, [navigate]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadTasks();
        const interval = setInterval(loadTasks, 3000);
        return () => clearInterval(interval);
    }, [loadTasks]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await createNewTask(formData);
            setFormData({ title: '', inputText: '', operation: 'uppercase' });
            loadTasks();
        } catch (err) {
            console.error('Task failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">AI Task Control</h1>
                        <p className="text-slate-500 mt-1">Distributed processing dashboard</p>
                    </div>
                    <button onClick={() => { logoutUser(); navigate('/'); }} 
                            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-medium">
                        Sign Out
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Input Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-800 mb-4">New Request</h2>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                                    <input name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} 
                                           className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Operation</label>
                                    <select name="operation" value={formData.operation} onChange={(e) => setFormData({...formData, operation: e.target.value})} 
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white">
                                        <option value="uppercase">Uppercase</option>
                                        <option value="lowercase">Lowercase</option>
                                        <option value="reverse">Reverse</option>
                                        <option value="word_count">Word Count</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                                    <textarea name="inputText" value={formData.inputText} onChange={(e) => setFormData({...formData, inputText: e.target.value})} 
                                              className="w-full border border-slate-200 rounded-lg px-3 py-2 min-h-32 outline-none" required />
                                </div>
                                <button disabled={isSubmitting} className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
                                    {isSubmitting ? 'Processing...' : 'Execute Task'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Status Panel */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h2 className="font-semibold text-slate-800">Job History</h2>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{tasks.length} Total</span>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {tasks.map(task => (
                                    <div key={task._id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-900">{task.title}</h3>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                                task.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 
                                                task.status === 'failed' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </div>
                                        <div className="flex gap-4 text-sm mb-3">
                                            <span className="text-slate-500 italic">{task.operation}</span>
                                            <span className="text-slate-300">|</span>
                                            <span className="text-slate-400 text-xs">ID: {task._id.slice(-6)}</span>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-sm font-mono text-slate-600">
                                            {task.result || "Waiting for worker..."}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}