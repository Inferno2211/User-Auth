const User = require('../models/User');
const Address = require('../models/Address')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

exports.registerUser = async (req, res) => {
    if (!req.body.email || !req.body.password)
        return res.status(400).json({ 'msg': "Either email or password is empty" });

    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(403).json({ "msg": "Email already registered." });
        }

        const salt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);

        const address = await Address.create({
            addressInfo: req.body.addressInfo,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode
        });

        const userDoc = await User.create({
            firstname: req.body.firstname || '',
            lastname: req.body.lastname || '',
            email: req.body.email,
            password: encryptedPassword,
            number: req.body.mobile,
            dob: req.body.dob,
            address: address._id,
            isPhoneVerified: false
        });

        res.status(201).json(userDoc);
    } catch (e) {
        res.status(400).json({ error: e });
    }
};

exports.loginUser = async (req, res) => {
    if (!req.body.email || !req.body.password)
        return res.status(400).json({ 'msg': "Either email or password is empty" });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('address');
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
            const token = jwt.sign({ email, id: user._id }, secret, { expiresIn: '24h' });
            res.json({
                id: user._id,
                email,
                token,
                isPhoneVerified: user.isPhoneVerified
            });
        } else {
            res.status(400).json("Wrong Credentials");
        }
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token').json({ msg: "Logged out successfully" });
};

exports.getProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const user = await User.findOne({ email }).populate('address');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        return res.status(200).json({
            id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            number: user.number,
            dob: user.dob,
            address: user.address,
            isPhoneVerified: user.isPhoneVerified
        });
    } catch (error) {
        return res.status(400).json({ message: 'Error fetching profile', error: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const { firstname, lastname, number, dob, addressInfo, city, state, pincode } = req.body;

        const updatedProfile = {};
        if (firstname) updatedProfile.firstname = firstname;
        if (lastname) updatedProfile.lastname = lastname;
        if (number) updatedProfile.number = number;
        if (dob) updatedProfile.dob = dob;

        if (addressInfo && city && state && pincode) {
            const address = await Address.create({
                addressInfo,
                city,
                state,
                pincode
            });
            updatedProfile.address = address._id;
        }

        await User.updateOne({ email }, { $set: updatedProfile });
        const updatedUser = await User.findOne({ email }).populate('address');

        return res.status(200).json({
            message: 'Profile updated successfully.',
            user: updatedUser
        });
    } catch (error) {
        return res.status(400).json({ message: 'Error updating profile', error: error.message });
    }
};