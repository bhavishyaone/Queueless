import User from "../../models/user.js";
import { USER_ROLES } from "../../utils/constants.js";
import bcrypt from 'bcrypt'
import { signToken } from "../../utils/jwt.js";


export const createAdmin = async ({name,email,password})=>{
    const adminExist = await User.exists({role:USER_ROLES.ADMIN})

    if(adminExist){
        throw new Error(`Admin already exists.`)
    }

    const hashedPassword = await bcrypt.hash(password,10)
    
    const admin = await User.create({
        name:name,
        email:email,
        password:hashedPassword,
        role:USER_ROLES.ADMIN
    })

    return admin
}



export const loginUser = async({email,password})=>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error(`User not found.`)
    }


    const match  = await bcrypt.compare(password,user.password)

    if(!match){
        throw new Error(`Invalid credential`)
    }

    const token = signToken({id:user._id,role:user.role})

    return {
        token,
        user:{
            id:user._id,
            name:user.name,
            role:user.role
        }
    }

}




