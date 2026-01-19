import mongoose from 'mongoose';
import ENV from './env.js'

const connectDB = async()=>{
    try{
        await mongoose.connect(ENV.MONGO_URL)
        console.log("Mongo DB Conect ho gaya hai.")
    }
    catch(err){
        console.log(err)
        console.log(`connection  failed ho gaya.`)
        process.exit(1)
    }
}
connectDB();

export default connectDB;


