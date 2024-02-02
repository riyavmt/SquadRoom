const userController = require('../controllers/user');
const express = require('express');
const router = express.Router();

router.post('/signup',userController.postSignup);
router.post('/login',userController.postLogin);

module.exports = router;