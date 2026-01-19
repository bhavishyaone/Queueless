import express, { Router } from 'express'

const router = Router()

router.get("/",(req,res)=>{
    return res.status(200).json({message:"Server chal gaya finally."})
});

export default router;