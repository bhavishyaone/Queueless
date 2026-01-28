import mongoose from 'mongoose';

const clinicschema = new mongoose.Schema({
    name:{type:String,required:true},
    address:String,
    openingHours:String,
    isOpen:{type:Boolean,default:false}
},
    {timestamps:true}
);

export default mongoose.model("Clinic",clinicschema);