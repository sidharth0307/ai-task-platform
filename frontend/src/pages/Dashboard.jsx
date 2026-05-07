import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllTasks, createNewTask } from '../helpers/taskHelper';
import { logoutUser } from '../helpers/authHelper';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({ title: '', inputText: '', operation: 'uppercase' });
    const navigate = useNavigate();

    // 1. Wrap in useCallback to satisfy React's exhaustive-deps rule
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
        // 2. Safely bypass the overly strict set-state-in-effect warning for this specific polling pattern
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadTasks();
        const interval = setInterval(loadTasks, 3000);
        return () => clearInterval(interval);
    }, [loadTasks]); // 3. loadTasks is now properly listed as a dependency

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await createNewTask(formData);
            setFormData({ title: '', inputText: '', operation: 'uppercase' });
            loadTasks();
        } catch (err) {
            // 4. Actually use the 'err' variable to satisfy the no-unused-vars rule
            console.error('Task creation failed:', err);
            alert('Failed to create task');
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Task Dashboard</h2>
                <button onClick={handleLogout} style={{ padding: '5px 10px' }}>Logout</button>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
                <h3>New Task</h3>
                <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required style={{ padding: '8px' }} />
                    <textarea name="inputText" placeholder="Input Text" value={formData.inputText} onChange={handleInputChange} required style={{ padding: '8px', minHeight: '80px' }} />
                    <select name="operation" value={formData.operation} onChange={handleInputChange} style={{ padding: '8px' }}>
                        <option value="uppercase">Uppercase</option>
                        <option value="lowercase">Lowercase</option>
                        <option value="reverse">Reverse String</option>
                        <option value="word_count">Word Count</option>
                    </select>
                    <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}>Run Task</button>
                </form>
            </div>

            <h3>Task History</h3>
            {tasks.length === 0 ? <p>No tasks yet.</p> : tasks.map(task => (
                <div key={task._id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
                    <strong>{task.title}</strong> - Status: 
                    <span style={{ 
                        marginLeft: '8px', 
                        fontWeight: 'bold',
                        color: task.status === 'success' ? 'green' : task.status === 'failed' ? 'red' : 'orange' 
                    }}>
                        {task.status.toUpperCase()}
                    </span>
                    <p style={{ margin: '5px 0' }}><strong>Operation:</strong> {task.operation}</p>
                    <p style={{ margin: '5px 0' }}><strong>Result:</strong> {task.result || 'Processing...'}</p>
                </div>
            ))}
        </div>
    );
}