import fs from "fs";
import User from "../models/User.js";
import path from "path";

//desc Update user profile
export const updateProfile = async (req, res) => {
    try{
        const {name,avatar,companyName,companyDescription,companyLogo,resume}=req.body;
        const user=await User.findById(req.user._id);
        if(!user) return res.status(404).json({message:"User not found"});

        user.name=name || user.name;
        user.avatar=avatar || user.avatar;
        user.resume=resume || user.resume;

        //If employer.allow updating company info
        if(user.role==="employer"){
            user.companyName=companyName || user.companyName;
            user.companyDescription=companyDescription || user.companyDescription;
            user.companyLogo=companyLogo || user.companyLogo;
        }

        await user.save();

        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role,
            companyName:user.companyName || '',
            companyDescription:user.companyDescription || '',
            companyLogo:user.companyLogo || '',
            resume:user.resume || ''
        })
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}


//desc Delete resume file(Jobseeker Only)

export const deleteResume = async (req, res) => {
    try{
        const {resumeUrl}=req.body;

        //extract filename from URL
        const filename=resumeUrl.split('/').pop();  

        const user=await User.findById(req.user._id);
        if(!user) return res.status(404).json({message:"User not found"});

        if(user.role!=="jobseeker") return res.status(403).json({message:"Only jobseeker can delete resume"});

        //construct full filepath
        const resumePath=path.join(__dirname,'../uploads',filename);

        //check if file exists
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath); //delete file
        }

        //set the users resume field to null
        user.resume=null;
        await user.save();

        res.json({message:"Resume deleted successfully"});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

//desc Get public profile
export const getPublicProfile = async (req, res) => {
    try{
        const user=await User.findById(req.params.id).select('-password');
        if(!user) return res.status(404).json({message:"User not found"});
        res.json(user);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}