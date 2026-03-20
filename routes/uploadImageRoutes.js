const express=require('express');
const router=express.Router();

const authMiddleware=require('../middleware/authMiddleware'); 
const isAdminUser=require('../middleware/adminMiddleware');
const uploadMiddleware=require('../middleware/uploadMiddleware');
const {uploadImageController,fetchImageController,deleteImageController}=require('../controllers/imageController');

//upload image
router.post('/upload',authMiddleware,isAdminUser,uploadMiddleware.single('image'),uploadImageController);
//to get all image
router.get('/get',authMiddleware, fetchImageController)

//delete image route
router.delete('/:id',authMiddleware,isAdminUser,deleteImageController);

module.exports=router;