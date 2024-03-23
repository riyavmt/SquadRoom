const userController = require('../controllers/user');
const userAuthentication = require("../Middleware/auth");
const express = require('express');
const router = express.Router();

router.post('/signup',userController.postSignup);
router.post('/login',userController.postLogin);

router.get("/users-list",userAuthentication.authenticate,userController.getUsersList);

module.exports = router;