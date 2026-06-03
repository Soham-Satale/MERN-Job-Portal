import Application from "../models/Application.js";
import Job from "../models/Job.js";

//desc Apply to a job

export const applyToJob = async (req, res) => {
    try{
        if(req.user.role!=='jobseeker') return res.status(403).json({message:"Only jobseekers can apply to jobs"});

        const existing=await Application.findOne({job:req.params.jobId,applicant:req.user._id});

        if(existing) return res.status(400).json({message:"You have already applied to this job"});

        const application=await Application.create({
            job:req.params.jobId,
            applicant:req.user._id,
            resume:req.user.resume
        });

        return res.status(201).json(application);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

//desc get logged-in user applications
export const getMyApplications = async (req, res) => {
    try{
        const apps=await Application.find({applicant:req.user._id})
        .populate("job","title company location type")
        .sort({createdAt:-1});

        res.json(apps);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}
//desc get all applications
export const getApplicantsForJob = async (req, res) => {
    try{
        const job=await Job.findById(req.params.jobId);

        if(!job || job.company.toString()!==req.user._id.toString()) return res.status(403).json({message:"Not authorized to view applicants"});

        const applications=await Application.find({job:req.params.jobId})
        .populate("applicant","name email avatar resume");

        res.json(applications);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

//desc get application by Id ( jobseeker or Employer)

export const getApplicationById = async (req, res) => {
    try{
        const app=await Application.findById(req.params.id)
        .populate("job","title company")
        .populate("applicant","name email avatar resume");

        if(!app) return res.status(404).json({message:"Application not found"});

        const isOwner=app.applicant.toString()===req.user._id.toString() ||
        app.job.company.toString()===req.user._id.toString();

        if(!isOwner) return res.status(403).json({message:"Not authorized to view this application"});

        res.json(app);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

//desc update applcation status(emplyer)
export const updateStatus = async (req, res) => {
    try{
        const {status}=req.body
        const allowedStatus = [
            "Applied",
            "Accepted",
            "Rejected"
        ];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }
        const app=await Application.findById(req.params.id).populate("job","company");
        if(!app || app.job.company.toString()!==req.user._id.toString()) return res.status(403).json({message:"not authorized to update this application"});

        app.status=status;
        await app.save();
        res.json({message:"Application status updated successfully",status});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

