const express=require('express');
const router=express.Router();

const authMiddleware=require('../middleware/authMiddleware'); 

router.get('/welcome',authMiddleware,(req,res)=>{
    const {username,userId,role}=req.userInfo;

    res.json({
        message: "Welcome to Home page",
        user:{
            id:userId,
            username:username,
            role:role
        }
});
})

module.exports=router;