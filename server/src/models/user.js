import mongoose  from "mongoose";
import { USER_ROLES } from "../utils/constants.js";

const userschema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    contactNUmber:{type:Number,required:true,unique:true},
    password:{type:String,required:true},
    roles:{
        type:String,
        enum:Object.values(USER_ROLES),
        required:true
    }},
    {timestamps:true}
);

// console.log("Available roles:", USER_ROLES);

export default mongoose.model("User",userschema)