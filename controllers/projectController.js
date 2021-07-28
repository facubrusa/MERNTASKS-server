const Project = require('../models/Project');
const Task = require('../models/Task');
const { validationResult } = require('express-validator');

// Create project and relacionate with the logged user
exports.createProject = async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Create the project
        const project = new Project(req.body);

        // Save the creator with JWT
        project.creator = req.user.id;

        // Save the project
        project.save();
        res.json(project);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}

// Get the projects of the logged user
exports.getProjects = async (req, res) => {
    try {
        // Create the project
        const projects = await Project.find({ creator: req.user.id });
        res.json({projects});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}

// Update name of one project
exports.updateProject = async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract the information
    const { name } = req.body;
    let newProject = {};

    if(name) newProject.name = name;

    try {
        // Check the ID
        let project = await Project.findById(req.params.id);

        // Validate the project exist
        if(!project) return res.status(404).json({ msg: 'Project not found'});
        
        // Verify the project creator
        // toString() get the creator id
        if(project.creator.toString() !== req.user.id) res.status(401).json({ msg: 'Not authorized'});
        
        // Update
        project = await Project.findByIdAndUpdate({ _id: req.params.id }, 
            { $set: newProject }, { new: true});

        res.json({project});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}

exports.deleteProject = async (req, res) => {
    try {
        // Check the ID
        let project = await Project.findById(req.params.id);

        // If the project don't exist
        if(!project) return res.status(404).json({ msg: 'Project not found'});
        
        // Verify the project creator
        if(project.creator.toString() !== req.user.id) res.status(401).json({ msg: 'Not authorized'});

        // Detele the tasks of the project
        await Task.deleteMany({ project: req.params.id });

        // Delete the project
        await Project.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Project deleted'});

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}