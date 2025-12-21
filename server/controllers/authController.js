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

// @desc    Get all users
// @route   GET /api/auth/all
// @access  Public (should be Admin, but strict auth is not implemented yet)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });

        // Enhance users with order count if Order model is available
        // Note: Ideally, this should be an aggregation query for performance, 
        // but for now, we'll keep it simple or just return users.
        // If we want order counts, we need to import Order model.
        // checking if Order model is required here or if we can do a simple lookup.

        // To keep it simple and performant for now:
        const usersWithStats = await Promise.all(users.map(async (user) => {
            // This is n+1 problem but fine for small scale. 
            // Better approach: User.aggregate lookup orders
            // For now, let's just return the user data.
            return {
                id: user._id,
                name: user.name,
                email: user.email || 'N/A', // Schema might not have email, using fallback
                phone: user.mobile,
                joined: user.createdAt,
                status: 'Active', // Default status as we don't have block logic yet
                orders: 0 // Placeholder, or we can fetch if needed
            };
        }));

        res.json(usersWithStats);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { loginUser, checkUser, getAllUsers };
