const express=require("express");
const router=express.Router();
const auth=require("../middleware/auth");
const messageController=require("../controller/messageController");
router.route("/").post(auth.auth,messageController.sendMessage);
router.route("/:chatId").get(auth.auth,messageController.allMessages);
module.exports=router;