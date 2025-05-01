const User = require('../models/user'); 
const Task = require('../models/task');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = async (req, res, next) =>
{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) 
    {
        return res.status(401).json({ status: false, message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];

    try 
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.authToken !== token) 
        {
            return res.status(401).json({ status: false, message: 'Invalid token' });
        }

        req.user = user; // Attach user to request
        next();
    } 
    catch (error) 
    {
        return res.status(401).json({ status: false, message: 'Unauthorized', error: error.message });
    }
};

const register = async (req, res) => 
{
    try 
    {
        const { uName, mobile, email, password, address } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ status: false, message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ uName, mobile, email, password: hashedPassword, address });

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        newUser.authToken = token; 

        await newUser.save();

        return res.status(201).json({
            status: true,
            message: 'Registration successful',
            auth_token: token,
            user: {
                id: newUser._id,
                uName: newUser.uName,
                email: newUser.email,
                mobile: newUser.mobile,
                address: newUser.address,
                createdAt: newUser.createdAt
            }
        });

    } catch (error) 
    {
        console.error('Register error:', error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};


const login = async (req, res) => 
{
    try 
    {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ status: false, message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ status: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        user.authToken = token; 
        await user.save();

        return res.status(200).json({
            status: true,
            message: 'Login successful',
            auth_token: token,
            user: {
                id: user._id,
                uName: user.uName,
                email: user.email,
                mobile: user.mobile,
                address: user.address,
                createdAt: user.createdAt
            }
        });
    } 
    catch (error) 
    {
        console.error('Login error:', error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: false, message: 'Authorization token missing' });
        }

        const token = authHeader.split(' ')[1];

        // Verify the token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ status: false, message: 'Invalid or expired token' });
        }

        // Find user by token and ID
        const user = await User.findOne({ _id: decoded.id, authToken: token });

        if (!user) {
            return res.status(404).json({ status: false, message: 'User not found or token mismatch' });
        }

        // Send user data
        return res.status(200).json({
            status: true,
            message: 'User profile fetched successfully',
            user: {
                id: user._id,
                uName: user.uName,
                email: user.email,
                mobile: user.mobile,
                address: user.address,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: 'Error fetching user', error: error.message });
    }
};
const createTask = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: false, message: 'Authorization token missing' });
        }

        const token = authHeader.split(' ')[1]; // Get the token from Bearer <token>

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user using the decoded token ID
        const user = await User.findById(decoded.id);
        if (!user || user.authToken !== token) {
            return res.status(401).json({ status: false, message: 'Invalid token' });
        }

        // Destructure task fields from request body
        const { title, description, dueDate, status } = req.body;

        // Create task and assign logged-in user's ID
        const task = new Task({
            title,
            description,
            dueDate,
            status,
            createdBy: user._id  // Use user ID from token
        });

        await task.save();

        return res.status(201).json({
            status: true,
            message: 'Task created successfully',
            task
        });
    } catch (error) {
        console.error('Add Task error:', error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};;


const getTasksByUser = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: false, message: 'Authorization token missing' });
        }

        const token = authHeader.split(' ')[1]; // Get the token from Bearer <token>

        // Verify the token and extract the user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user using the decoded token ID
        const user = await User.findById(decoded.id);
        if (!user || user.authToken !== token) {
            return res.status(401).json({ status: false, message: 'Invalid token' });
        }

        // Fetch tasks that are created by the logged-in user
        const tasks = await Task.find({ createdBy: user._id });

        // Return tasks if found
        if (tasks.length === 0) {
            return res.status(404).json({ status: false, message: 'No tasks found for this user' });
        }

        return res.status(200).json({
            status: true,
            message: 'Tasks fetched successfully',
            tasks
        });

    } catch (error) {
        console.error('Get Tasks error:', error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;  // Extract task ID from URL params

        // Find and delete the task by its ID
        const task = await Task.findByIdAndDelete(taskId);

        if (!task) {
            return res.status(404).json({ status: false, message: 'Task not found' });
        }

        return res.status(200).json({
            status: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        console.error('Delete Task error:', error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};


const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params; // Task ID from URL
        const { status } = req.body; // New status from request body

        if (!status) {
            return res.status(400).json({ status: false, message: 'Status is required' });
        }

        const task = await Task.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return updated document
        );

        if (!task) {
            return res.status(404).json({ status: false, message: 'Task not found' });
        }

        return res.status(200).json({
            status: true,
            message: 'Task status updated successfully',
            task
        });
    } catch (error) {
        console.error('Update Task Status error:', error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};


const updateTask = async (req, res) => {
    try {
        const { id } = req.body; // Task ID in body
        const { title, description, dueDate, status } = req.body;

        if (!id) {
            return res.status(400).json({ status: false, message: 'Task ID is required' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, dueDate, status },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ status: false, message: 'Task not found' });
        }

        return res.status(200).json({
            status: true,
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (error) {
        console.error('Update Task error:', error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};

const getTaskById = async (req, res) => {
    try 
    {
        const taskId = req.params.id;
        const task = await Task.findById(taskId);

        if (!task) 
        {
            return res.status(404).json({ status: false, message: 'Task not found' });
        }

        return res.status(200).json({
            status: true,
            message: 'Task fetched successfully',
            task
        });
    } catch (error) 
    {
        console.error('Get Task By ID error:', error);
        return res.status(500).json({ status: false, message: 'Server error', error: error.message });
    }
};
module.exports = {
    login,
    register,updateTaskStatus,updateTask,
    getUser,createTask,getTasksByUser,deleteTask,getTaskById
};

