const express=require('express');
const router=express.Router();
const authMiddleware=require('../middleware/authMiddleware'); 
const isAdminUser=require('../middleware/adminMiddleware');
router.get('/welcome',authMiddleware,isAdminUser,(req,res)=>{
    res.json({
        message:"welcome to admin page"
    })
})
module.exports=router;