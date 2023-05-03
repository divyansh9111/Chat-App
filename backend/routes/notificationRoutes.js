const express=require("express");
const router=express.Router();
const notificationController=require("../controller/notificationController");
const auth=require("../middleware/auth");

router.route('/').post(auth.auth,notificationController.setNotifications);
router.route('/').get(auth.auth,notificationController.getNotifications);
router.route('/').delete(auth.auth,notificationController.updateNotifications);

module.exports=router;