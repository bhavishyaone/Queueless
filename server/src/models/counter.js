import mongoose  from "mongoose";
import { COUNTER_STATUS } from "../utils/constants.js";

const counterschema = new mongoose.Schema(
    {
        name:{type:String,required:true},
        status:{
            type:String,
            enum:Object.values(COUNTER_STATUS),
            default:COUNTER_STATUS.ACTIVE
        }
    },
    {timestamps:true}
);
// console.log(COUNTER_STATUS)

export default mongoose.model("Counter",counterschema)