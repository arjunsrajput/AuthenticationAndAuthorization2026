const express=require('express');
const router=express.Router();
const {registerUser,loginUser,changePassword}=require('../controllers/authController');

const authMiddleware=require('../middleware/authMiddleware'); 
//all routes related to authentication and authorization

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/change-password',authMiddleware,changePassword);

module.exports=router;