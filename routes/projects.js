// Routes for abm projects
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Create project
// api/projects
router.post('/',
    [
        check('name', 'The name of the project is required').not().isEmpty(),
    ],
    auth,
    projectController.createProject
);

// Get projects
router.get('/',
    auth,
    projectController.getProjects
);

// Update project
router.put('/:id',
    [
        check('name', 'The name of the project is required').not().isEmpty(),
    ],
    auth,
    projectController.updateProject
);

// Delete project
router.delete('/:id',
    auth,
    projectController.deleteProject
);

module.exports = router;