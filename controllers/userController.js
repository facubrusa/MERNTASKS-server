const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    // Validate form
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    } 

    // Extract email and password
    const { email, password } = req.body;

    try {
        // Check that the registered user is unique
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({ msg: 'The user already exists' });
        }

        // Create the obj user
        user = new User(req.body);

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        // Save the user
        await user.save();

        // Create the JWT (Json web token)
        const payload = {
            user: {
                id: user.id
            }
        };

        // Sign the JWT
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
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