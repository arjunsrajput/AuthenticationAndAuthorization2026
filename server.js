require('dotenv').config();
const express=require("express");
const authRoutes=require('./routes/authRoutes');
const homeRoutes=require('./routes/homeRoutes');
const adminRoutes=require('./routes/adminRoutes');
const uploadImageRoutes=require('./routes/uploadImageRoutes.js');

const connectToDB=require('./database/db.js');

connectToDB();

const app=express();
const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/home',homeRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/image',uploadImageRoutes);

app.listen(PORT,()=>{
    console.log("Server Started......");
    
})