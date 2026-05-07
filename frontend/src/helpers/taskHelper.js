import api from './api';

export const fetchAllTasks = async () => {
    const response = await api.get('/tasks');
    return response.data;
};

export const createNewTask = async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
};