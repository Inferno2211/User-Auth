const User = require('../models/User');
const { createVerification, createVerificationCheck } = require('../middlewares/authMobile');

const sendVerificationCode = async (req, res) => {
    const { userId, newNumber } = req.body;
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.isPhoneVerified) {
            return res.status(400).json({ message: 'Phone already verified' });
        }

        if (newNumber) {
            const existingUser = await User.findOne({
                number: '+91' + newNumber,
                _id: { $ne: userId }
            });

            if (existingUser) {
                return res.status(400).json({ message: 'Phone number already in use' });
            }
        }

        const phoneNumber = newNumber ? newNumber : user.number;

        await createVerification(phoneNumber);

        if (newNumber) {
            await User.findByIdAndUpdate(userId, {
                tempNumber: newNumber
            });
        }

        res.status(200).json({
            message: 'Verification code sent',
            userId: user._id,
            phoneNumber: phoneNumber
        });
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Error sending verification code' });
    }
};

const checkVerificationCode = async (req, res) => {
    const { userId, phoneNumber, code } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const verificationResult = await createVerificationCheck(code, phoneNumber);

        if (verificationResult.status === 'approved') {
            await User.findByIdAndUpdate(userId, { isPhoneVerified: true });
            res.status(200).json({
                message: 'Phone verified successfully',
                isPhoneVerified: true
            });
        } else {
            res.status(400).json({
                message: 'Invalid verification code',
                isPhoneVerified: false
            });
        }
    } catch (error) {
        console.error('Verification check error:', error);
        res.status(500).json({ message: 'Error checking verification code' });
    }
};

module.exports = {
    sendVerificationCode,
    checkVerificationCode
};
