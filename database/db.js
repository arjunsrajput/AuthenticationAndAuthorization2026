
const mongoose=require('mongoose');
const connectToDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo DB connected successfully");
        
    }catch(e){
        console.error("Mongo Connection Failed");
        console.error(e.message); 
        process.exit(1);
    }
}
module.exports=connectToDB;