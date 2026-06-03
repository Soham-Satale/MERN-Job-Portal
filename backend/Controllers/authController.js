import User from "../models/User.js";
import jwt from "jsonwebtoken";

//Generate token
const generateToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{expiresIn:"60d"});
};

//desc Register new user
export const register = async (req, res) => {
    try{
        const {name,email,password,avatar,role}=req.body;
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message:"User already exists"});
        }
        const user=await User.create({name,email,password,avatar,role});

        res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role,
            token:generateToken(user._id),
            companyName:user.companyName || '',
            companyDescription:user.companyDescription || '',
            companyLogo:user.companyLogo || '',
            resume:user.resume || ''
        });
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
}



//desc Login user
export const login = async (req, res) => {
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email}); 
        if(!user || !(await user.matchPassword(password))){
           return res.status(400).json({message:"Invalid credentials"});
        }
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role,
            token:generateToken(user._id),
            companyName:user.companyName || '',
            companyDescription:user.companyDescription || '',
            companyLogo:user.companyLogo || '',
            resume:user.resume || ''
        })
    }
    catch(err){
    res.status(500).json({error:err.message});
}
};

//desc Get logged in user
export const getMe = async (req, res) => {
    res.json(req.user);
}

// universal employer

//   "name":"Shubhamkar Satale",
//   "email":"shubhu@gmail.com",
//   "password":"123456",
//   "role":"employer"
// }


//universal jobseeker 

// {
//   "name":"Harsh Kadam",
//   "email":"Harsh@gmail.com",
//   "password":"123456",
//   "role":"jobseeker"
// }