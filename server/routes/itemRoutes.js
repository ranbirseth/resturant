const express = require('express');
const router = express.Router();
const { getItems, seedItems } = require('../controllers/itemController');

router.get('/', getItems);
router.post('/seed', seedItems);

module.exports = router;
