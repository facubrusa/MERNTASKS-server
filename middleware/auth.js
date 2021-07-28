const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Read token from header
    const token = req.header('x-auth-token');

    // Check for token
    if(!token) {
        return res.status(401).send({ msg: 'No token found, invalid permission'});
    }

    // Validate token
    try {
        const encryption = jwt.verify(token, process.env.SECRET);
        req.user = encryption.user;
        next();
    } catch (error) {
        res.status(500).json({ msg: 'Error validate token'});
    }
}