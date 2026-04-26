const express = require('express');
const router = express.Router();
const { renderHomePage, createUser } = require('../controllers/userController');

// GET request to load the form
router.get('/', renderHomePage);

// POST request to submit the form
router.post('/users', createUser);

module.exports = router;
