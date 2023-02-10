const auth=require("../middleware/auth");
const express=require("express");
const router=express.Router();
const chatController=require("../controller/chatController");

router.route('/').post(auth.auth,chatController.accessChat).get(auth.auth,chatController.fetchChats);
router.route('/group').post(auth.auth,chatController.createGroupChat);
router.route("/rename").patch(auth.auth,chatController.renameGroup);
router.route("/addGroup").patch(auth.auth,chatController.addToGroup);
router.route("/removeGroup").patch(auth.auth,chatController.removeFromGroup);
module.exports =router;