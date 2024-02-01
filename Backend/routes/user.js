const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.post('/signup',userController.postSignup);

module.exports = router;