const express = require('express');
const router = express.Router();

const {
    register,login,getUser,createTask,getTasksByUser,deleteTask,updateTaskStatus,updateTask,getTaskById
} = require('../controllers/user');
router.post('/register', register);
router.post('/login', login);
router.get('/get-user', getUser);
// router.post('/addTask', addTask);
router.post('/create-task',createTask);
router.get('/get-tasks', getTasksByUser);
router.get('/delete-task/:id', deleteTask);
router.post('/update-task-status/:id', updateTaskStatus);
router.post('/update-task', updateTask);
router.get('/task/:id', getTaskById);
module.exports = router;
