import SavedJob from "../models/SavedJob.js";


//desc save a job
export const saveJob=async(req,res)=>{
    try{
        const exists=await SavedJob.findOne({job:req.params.jobId,jobseeker:req.user._id});
        if(exists) return res.status(400).json({message:"Job already saved"});

        const saved=await SavedJob.create({job:req.params.jobId,jobseeker:req.user._id});
        res.status(201).json(saved);
    }
    catch(err){
        res.status(500).json({message:"Failed to save job",error:err.message})
    }
}

//desc unsave a job

export const unSaveJob=async(req,res)=>{
    try{
        await SavedJob.findOneAndDelete({job:req.params.jobId,jobseeker:req.user._id});
        res.json({message:"Job unsaved successfully"});
    }
    catch(err){
        res.status(500).json({message:"Failed to unsave job",error:err.message})
    }
}

//desc get saved jobs for current user

export const getSavedJobs=async(req,res)=>{
    try{
        const savedJobs=await SavedJob.find({jobseeker:req.user._id}).
        populate({
            path:"job",
            populate:{
                path:"company",
                select:"name companyName companyLogo"
            }
        });
        res.json(savedJobs);
        
    }
    catch(err){
        res.status(500).json({message:"Failed to fetch saved jobs",error:err.message})
    }
}