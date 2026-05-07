import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllTasks, createNewTask } from '../helpers/taskHelper';
import { logoutUser } from '../helpers/authHelper';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({ title: '', inputText: '', operation: 'uppercase' });
    const navigate = useNavigate();

    const loadTasks = async () => {
        try {
            const data = await fetchAllTasks();
            setTasks(data);
        } catch (err) {
            if (err.response?.status === 401) {
                logoutUser();
                navigate('/');
            }
        }
    };

    // Polling setup
    useEffect(() => {
        loadTasks();
        const interval = setInterval(loadTasks, 3000);
        return () => clearInterval(interval);
    }, []);

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
            alert('Failed to create task');
        }
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h2>Task Dashboard</h2>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
                <h3>New Task</h3>
                <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
                    <textarea name="inputText" placeholder="Input Text" value={formData.inputText} onChange={handleInputChange} required />
                    <select name="operation" value={formData.operation} onChange={handleInputChange}>
                        <option value="uppercase">Uppercase</option>
                        <option value="lowercase">Lowercase</option>
                        <option value="reverse">Reverse String</option>
                        <option value="word_count">Word Count</option>
                    </select>
                    <button type="submit">Run Task</button>
                </form>
            </div>

            <h3>Task History</h3>
            {tasks.map(task => (
                <div key={task._id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
                    <strong>{task.title}</strong> - Status: {task.status.toUpperCase()}
                    <p>Operation: {task.operation}</p>
                    <p>Result: {task.result || 'Processing...'}</p>
                </div>
            ))}
        </div>
    );
}