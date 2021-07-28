const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Create project
// api/projects
router.post('/',
    [
        check('name', 'The name of the task is required').not().isEmpty(),
        check('project', 'The project id is required').not().isEmpty()
    ],
    auth,
    taskController.createTask
);

// Get tasks
router.get('/',
    auth,
    taskController.getTasks
);

// Update task
router.put('/:id',
    [
        check('name', 'The name of the task is required').not().isEmpty(),
        check('project', 'The project id is required').not().isEmpty()
    ],
    auth,
    taskController.updateTask
);

// Delete task
router.delete('/:id',
    auth,
    taskController.deleteTask
);

module.exports = router;