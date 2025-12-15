const express = require('express');
const router = express.Router();
const { loginUser, checkUser } = require('../controllers/authController');

router.post('/login', loginUser);
router.post('/check', checkUser);

module.exports = router;
