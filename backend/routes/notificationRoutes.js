const express=require("express");
const router=express.Router();
const notificationController=require("../controller/notificationController");
const auth=require("../middleware/auth");

router.route('/').post(notificationController.setNotifications);
router.route('/').get(auth.auth,notificationController.getNotifications);
router.route('/').delete(notificationController.updateNotifications);

module.exports=router;