const express=require("express");
const router=express.Router();
const userController=require("../controller/userController");
const auth=require("../middleware/auth");

router.route('/').post(userController.registerUser).get(auth.auth,userController.allUsers);
router.route('/login').post(userController.authUser);
router.route('/send-verification-code').post(userController.sendVerificationCode);

module.exports=router;