import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Middleware to protect routes

const protect = async (req, res, next) => {
    try{
        let token=req.headers.authorization;

        if(token && token.startsWith('Bearer')){
            token=token.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
            req.user=await User.findById(decoded.id).select('-password');
            next();
        }else{
            res.status(401).json({message:"Not authorized, token failed"});
        }
    }catch(err){
        res.status(401).json({message:"Not authorized, token failed", error:err.message});
    }
};

export default protect;