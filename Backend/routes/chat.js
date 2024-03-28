const chatController = require("../controllers/chat");
const userAuthentication = require("../Middleware/auth");
const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const uploads = multer({storage});

router.post('/message',userAuthentication.authenticate,chatController.postMessage);
router.post('/sendFile',userAuthentication.authenticate,uploads.array("file"),chatController.sendFile)
router.get('/message',userAuthentication.authenticate,chatController.getMessage);
router.post('/createGroup',userAuthentication.authenticate,chatController.postCreateGroup);
router.get('/getGroup',userAuthentication.authenticate,chatController.getGroup);
router.get('/get-members',chatController.getMembers);
module.exports = router;