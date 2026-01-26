import { createAdmin,loginUser } from "./auth.service.js";
import { z} from 'zod'


const adminSchema = z.object({
    name:z.string(),
    email:z.string(),
    password:z.string().min(6)
})


const loginSchema = z.object({
    email:z.string(),
    password:z.string()
})

export const setupAdmin = async(req,res)=>{
    try{
        const data = adminSchema.parse(req.body);
        const admin = await createAdmin(data);
        return res.status(201).json({
            message:"Admin Created.",
            admin:{id:admin._id,email:admin.email}
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error"})
    }
};

export const login = async (req,res)=>{
    try{
        const data  = loginSchema.parse(req.body)
        const result = await loginUser(data)
        res.json(result)
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error"})

    }
}

