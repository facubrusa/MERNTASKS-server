// Routes for create users
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');

// Create user
// api/users
router.post('/',
    [
        check('name', 'The name is required').not().isEmpty(),
        check('email', 'Insert a valid email').isEmail(),
        check('password', 'The password must contain more than 6 characters').isLength({ min: 6})
    ], 
    userController.createUser
);

module.exports = router;