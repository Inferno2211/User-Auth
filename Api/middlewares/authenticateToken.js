const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token required' });

    try {
        req.user = jwt.verify(token, secret);
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateToken;