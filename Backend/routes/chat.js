const chatController = require("../controllers/chat");
const userAuthentication = require("../Middleware/auth");
const express = require('express');
const router = express.Router();

router.post('/message',userAuthentication.authenticate,chatController.postMessage);
router.get('/message',chatController.getMessage);

module.exports = router;