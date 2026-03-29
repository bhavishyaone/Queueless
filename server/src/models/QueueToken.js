import mongoose from "mongoose";
import { QUEUE_STATUS } from "../utils/constants.js";



const queuetokenschema = new mongoose.Schema(
    {
        tokenNumber:{type:Number,required:true},
        queueDate:{type:String,required:true},
        status:{
            type:String,
            enum:Object.values(QUEUE_STATUS),
            default:QUEUE_STATUS.WAITING
        },
        counterId:{type:mongoose.Schema.Types.ObjectId,ref:"Counter"},
        counterNameSnapshot: String,
        servedBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        servedAt: Date,
        skippedAt: Date,
        completedAt: Date
    },
    {timestamps:true}
);

queuetokenschema.index({ queueDate: 1 });
queuetokenschema.index({ status: 1 });
// console.log(QUEUE_STATUS)
export default mongoose.model("QueueToken",queuetokenschema);
