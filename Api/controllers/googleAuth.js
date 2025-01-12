// controllers/authController.js
const successRedirect = (req, res) => {
    res.redirect(`http://localhost:3000/auth/success?user=${JSON.stringify(req.user)}`);
};

const failureRedirect = (req, res) => {
    res.redirect('http://localhost:3000/auth/failure');
};

const getCurrentUser = (req, res) => {
    if (req.user) {
        res.json({ user: req.user });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
};

const logout = (req, res) => {
    req.logout();
    res.json({ message: 'Logged out successfully' });
};

module.exports = {
    successRedirect,
    failureRedirect,
    getCurrentUser,
    logout
};