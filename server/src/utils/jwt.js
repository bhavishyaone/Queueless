import jwt from 'jsonwebtoken';
import ENV from '../config/env.js';

export const signToken = ()=>{
    return jwt.sign(payload,ENV.JWT_SECRET,{expiresIn:"1d"})
};

export const verifyToken = ()=>{
    return jwt.verify(token,ENV.JWT_SECRET)
};


