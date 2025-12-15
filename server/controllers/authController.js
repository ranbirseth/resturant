const User = require('../models/User');

// @desc    Login/Register User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
        return res.status(400).json({ message: 'Please provide name and mobile number' });
    }

    try {
        let user = await User.findOne({ mobile });

        if (!user) {
            user = await User.create({ name, mobile });
        } else {
            // Update name if changed (optional)
            user.name = name;
            await user.save();
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            mobile: user.mobile
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check if user exists
// @route   POST /api/auth/check
// @access  Public
const checkUser = async (req, res) => {
    const { mobile } = req.body;
    try {
        const user = await User.findOne({ mobile });
        if (user) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { loginUser, checkUser };
