const express = require('express');
const router = express.Router();
const { getItems, seedItems, createItem, updateItem, deleteItem } = require('../controllers/itemController');

router.get('/', getItems);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.post('/seed', seedItems);

module.exports = router;
