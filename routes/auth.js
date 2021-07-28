// Routes for athentication
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator');
const auth = require('../middleware/auth');

// Login user
// api/auth
router.post('/',
    [
        check('email', 'Insert a valid email').isEmail(),
        check('password', 'The password must contain more than 6 characters').isLength({ min: 6})
    ], 
    authController.authenticateUser
);

// Get data user from authenticated user
router.get('/',
    auth,
    authController.authenticatedUser
);

module.exports = router;