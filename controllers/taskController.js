const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Create task
exports.createTask = async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Get the project id
        const { project } = req.body;

        const projectExist = await Project.findById(project);

        // Validate the project exist
        if(!projectExist) return res.status(404).json({ msg: 'Project not found'});

        // Verify the project creator
        if(projectExist.creator.toString() !== req.user.id) res.status(401).json({ msg: 'Not authorized'});

        // Create task
        const task = new Task(req.body);
        await task.save();
        res.json(task);

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}

exports.getTasks = async (req, res) => {
    try {
        // Get the project id
        const { project } = req.query;

        const projectExist = await Project.findById(project);

        // Validate the project exist
        if(!projectExist) return res.status(404).json({ msg: 'Project not found'});

        // Verify the project creator
        if(projectExist.creator.toString() !== req.user.id) res.status(401).json({ msg: 'Not authorized'});

        const tasks = await Task.find({ project }).sort({ register: -1 });
        res.json({tasks});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}

exports.updateTask = async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Get the project id and the name
        const { name, project, status } = req.body;

        // Validate the task exist
        let task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ msg: 'Task not found'});
        
        let projectExist = await Project.findById(project);

        // Verify the project creator
        if(projectExist.creator.toString() !== req.user.id) res.status(401).json({ msg: 'Not authorized'});

        let newTask = {
            name,
            status
        };

        // Update
        task = await Task.findByIdAndUpdate({ _id: req.params.id }, 
            { $set: newTask }, { new: true});

        res.json({task});

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}

exports.deleteTask = async (req, res) => {
    try {
        // Get the project id
        const { project } = req.query;

        // Validate the task exist
        let task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({ msg: 'Task not found'});

        let projectExist = await Project.findById(project);
        
        // Verify the project creator
        if(projectExist.creator.toString() !== req.user.id) res.status(401).json({ msg: 'Not authorized'});

        // Delete the task
        await Task.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Task deleted'});

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}