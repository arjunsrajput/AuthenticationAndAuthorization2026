const User=require('../models/User');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken'); 
//Register Controller
const registerUser=async(req,res)=>{
    try{
        const {username,email,password,role}=req.body;
        const checkExistingUser=await User.findOne({$or : [{username},{email}]});
        if(checkExistingUser){
            return res.status(400).json({
                success:false,
                message:'User is already exist either with same username or email'
            });
        }
        if(!username || !email || !password){
            return res.status(400).json({
                success:false,
                message:'All fields all required'
            });
         }
        //hash user password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        //Create new user and save in database
        const newlyCreatedUser=new User({
            username,
            email,
            password:hashedPassword,
            role:role || 'user'
        });

        await newlyCreatedUser.save();
        if(newlyCreatedUser){
            res.status(201).json({
                success:true,
                message:'User Registerd Successfully',
            })
        }else{
            res.status(400).json({
                success:false,
                message:'Unable to Register User',
            })
        }

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Something went wrong, Please try again',
        })
    }
}

//LoginUser Controller

const loginUser=async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User doesnt exist"
            })
        }
        //If the password is match or not
        const isPasswordMatch= await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid Credentials"
            })
        }
        //Create JWT UserToken
        const accessToken=jwt.sign({
            userID:user._id,
            username:user.username,
            role:user.role
        },process.env.JWT_SECRET_KEY,{
            expiresIn:"50m"
        }) 
        res.status(200).json({
            success:"true",
            message:"Logged in successfully",
            accessToken
        })
    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Something went wrong, Please try again',
        })
    }
} 

//change password controller

const changePassword=async(req,res)=>{
    try{
        const userId=req.userInfo.userID;
        //extract old and new password
        const {oldPassword,newPassword}=req.body;

        //find the current logged in user
        const user= await User.findById(userId);
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        //check if old password is correct
        const isPasswordMatch= await bcrypt.compare(oldPassword,user.password);
        if(!isPasswordMatch) return res.status(400).json({success:false,message:"Old Password is not correct ! Please try again"});

        //hash the new password
        const salt=await bcrypt.genSalt(10);
        const newHashedPassword= await bcrypt.hash(newPassword,salt);

        //update user password
        user.password=newHashedPassword;
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Password changed successfully"
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:'Something went wrong, Please try again',
        })
    }
}

module.exports={registerUser,loginUser,changePassword};
