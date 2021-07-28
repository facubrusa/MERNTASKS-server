const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async (req, res) => {
    // Validate form
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Extract email and password
    const { email, password } = req.body;

    try {
        // Check that the user exist
        let user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ msg: 'The user not exists' });
        }

        // Check the password is correct
        const validatePass = await bcryptjs.compare(password, user.password);
        if(!validatePass) {
            return res.status(400).json({ msg: 'The password is not correct' });
        }

        // If everything is correct, create the JWT (Json web token)
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign the JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 28800 //8hs duration
        }, (error, token) => {
            if(error) throw error;

            // Confirmation message
            res.json({ token });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}

exports.authenticatedUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); // Get all columns except password
        if(!user) return res.status(400).json({ msg: 'The user not exists' });
        res.json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error :c'});
    }
}