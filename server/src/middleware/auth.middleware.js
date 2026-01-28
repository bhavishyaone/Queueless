import jwt from "jsonwebtoken";
import  ENV  from "../config/env.js";
import User from "../models/user.js";

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    // console.log('JWT_SECRET in verify:', ENV.JWT_SECRET);
    // console.log('Token received:', token);
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: "Invalid token" });
  }
};
