const Image=require('../models/image');
const uploadToCloudinary = require('../helper/cloudinaryHelper')
const cloudinary=require('../config/cloudinary');
const uploadImageController=async(req,res)=>{
    try{
        //check if file is present in req object
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:'File is required ! Please upload a image file.....'
            })
        }
        //upload to cloudinary
        const {url,publicId}=await uploadToCloudinary(req.file.path);

        //now store in database
        const newlyUploadedImage= new Image({
            url,
            publicId,
            uploadedBy:req.userInfo.userID
        });
        await newlyUploadedImage.save();
        return res.status(201).json({
            success:true,
            message:"Image Uploaded successfully",
            image:newlyUploadedImage

        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
        
    }
}

const fetchImageController=async(req,res)=>{
    try{
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) ||2;
        const skip=(page-1)*limit;

        const sortBy=req.query.sortBy || "createdAt";
        const sortOrder=req.query.sortOrder === "asc"?1:-1;
        const totalImage= await Image.countDocuments();
        const totalPages=Math.ceil(totalImage/limit);

        const sortObj = {};
        sortObj[sortBy]=sortOrder;
        const images=await Image.find().sort(sortObj).skip(skip).limit(limit);

        // const image = await Image.find({});

        if(images){
            res.status(200).json({
                success:true,
                currentPage:page,
                totalPages:totalPages,
                totalImage:totalImage,
                data:images,
            })
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

const deleteImageController= async(req,res)=>{
    try{
        const getCurrentIdOfImageToBeDeleted=req.params.id;
        const userId=req.userInfo.userID;
        const image= await Image.findById(getCurrentIdOfImageToBeDeleted);
        if(!image){
            return res.status(404).json({
                success:false,
                message:"Image is not found....!"
            })
        };

        //check if the image is uploaded by current the user who is trying to delete it 
        console.log(image.uploadedBy.toString())
        console.log(userId)
        if(image.uploadedBy.toString()!==userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this image because you haven't uploaded it "
            })
        }
        //delete first from cloudinary
        await cloudinary.uploader.destroy(image.publicId);

        //now delete from db
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

        return res.status(200).json({
            success:true,
            message:"Image deleted successfully"
        });

    }catch(e){
        console.log(e);
        res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

module.exports={uploadImageController,fetchImageController,deleteImageController}