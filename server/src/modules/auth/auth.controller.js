import { createAdmin, loginUser, getAllStaffUsers, createStaffUser, getAllUsers } from "./auth.service.js";
import User from "../../models/user.js";
import { z } from 'zod'


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
        res.json({
            ...result,
            message: "You are logged in"
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"server error"})

    }
}

export const getAllStaff = async (req, res) => {
    try {
        const staff = await getAllStaffUsers();
        return res.status(200).json(staff);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};

export const createStaff = async (req, res) => {
    try {
        const staff = await createStaffUser(req.body);
        return res.status(201).json({ message: "Staff Created.", staff: { id: staff._id, email: staff.email, role: staff.role } });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message || "server error" });
    }
};

export const getUsersList = async (req, res) => {
    try {
        const users = await getAllUsers();
        return res.status(200).json(users);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "Staff not found" });
        return res.status(200).json({ message: "Staff deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};

export const updateMe = async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(req.user._id, { name }, { new: true }).select('-password');
        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "server error" });
    }
};
