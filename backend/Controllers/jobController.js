import Job from "../models/Job.js";
import User from "../models/User.js";
import Application from "../models/Application.js";
import SavedJob from "../models/SavedJob.js";
import { application } from "express";

//desc create a new job(Employer only)

export const createJob = async (req, res) => {
    try {
        if (req.user.role !== 'employer') return res.status(403).json({ message: "Only employers can post jobs" });
        const job = await Job.create({ ...req.body, company: req.user._id });
        res.status(201).json(job);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const getJobs = async (req, res) => {

    const { keyword, location, category, type, minSalary, maxSalary, userId } = req.query;
    const query = {
        isClosed: false,
        ...(keyword &&{
            $or: [
                { title:{ $regex: keyword,$options:"i" } },
                { description:{$regex:keyword,$options:"i" } },
                { requirements:{$regex:keyword,$options:"i" } }
            ]
        }),
        ...(location && {location:{$regex:location,$options:"i" } }),
        ...(category && {category}),
        ...(type && {type}),

    }

    if (minSalary || maxSalary) {
        query.$and = [];

        if (minSalary) {
            query.$and.push({ salaryMax: { $gte: Number(minSalary) } });
        }
        if (maxSalary) {
            query.$and.push({ salaryMin: { $lte: Number(maxSalary) } });
        }
        if (query.$and.length === 0) {
            delete query.$and;
        }
    }


    try {
        const jobs = await Job.find(query).populate("company", "name companyName companyLogo");
        let savedJobIds = [];
        let appliedJobStatusMap = {};
        if (userId) {
            //saved jobs
            const savedJobs = await SavedJob.find({ jobseeker: userId }).select("job");
            savedJobIds = savedJobs.map((s) => {
                return String(s.job);
            });

            //Application
            const applications = await Application.find({ applicant: userId }).select("job status");
            applications.forEach((app) => {
                appliedJobStatusMap[String(app.job)] = app.status;
            });
        }

        //Add isSaved and applicationStatus to each job
        const jobwithExtras = jobs.map((job) => {
            const jobIdstr = String(job._id);
            return {
                ...job.toObject(),
                isSaved: savedJobIds.includes(jobIdstr),
                applicationStatus: appliedJobStatusMap[jobIdstr] || null
            }
        })

        res.json(jobwithExtras);

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}


//desc Get jobs for logged in user (Employer can see posted jobs)

export const getJobsEmployer = async (req, res) => {
    try {
        const userId=req.user._id;
        const {role}=req.user;

        if(role!=='employer') return res.status(403).json({message:"Access denied"});

        //Get all jobs posted by employer
        const jobs=await Job.find({company:userId}).
                   populate("company","name companyName companyLogo").
                   lean()  //makes jobs plain js objects so we can add new fields

        //count applications for each job
        const jobwithApplicationscounts=await Promise.all(
            jobs.map(async(job)=>{
                const applicationsCount=await Application.countDocuments({job:job._id});
                return {
                    ...job,
                    applicationsCount
                }
            })
        )

        res.json(jobwithApplicationscounts);

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//desc get single job by ID

export const getJobById = async (req, res) => {
    try {
        const {userId}=req.query;

        const job = await Job.findById(req.params.id).populate("company", "name companyName companyLogo");

        if (!job) return res.status(404).json({ message: "Job not found" });

        let applicationStatus = null;
        if (userId) {
            const application = await Application.findOne({ job: job._id, applicant: userId }).select("status");
        }
        if(application){
            applicationStatus=application.status;
        }
        res.json({ 
            ...job.toObject(),
            applicationStatus 
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//desc update a job(Employer only)

export const updateJob = async (req, res) => {
    try {
        const job=await Job.findById(req.params.id);
        if(!job) return res.status(404).json({message:"Job not found"});

        if(job.company.toString()!==req.user._id.toString()) return res.status(403).json({message:"Access denied"});

        Object.assign(job,req.body);
        const updated=await job.save();
        res.json(updated);

    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
//desc Delete a job(Employer only)

export const deleteJob = async (req, res) => {
    try {
        const job=await Job.findById(req.params.id);
        if(!job) return res.status(404).json({message:"Job not found"});

        if(job.company.toString()!==req.user._id.toString()) return res.status(403).json({message:"Not authorized to delete this job"});

        await job.deleteOne();
        res.json({message:"Job deleted successfully!"});
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//desc Toggle close status for a job(Employer only)

export const toggleCloseJob = async (req, res) => {
    try {
        const job=await Job.findById(req.params.id);
        if(!job) return res.status(404).json({message:"Job not found"});

        if(job.company.toString()!==req.user._id.toString()) return res.status(403).json({message:"Not authorized to update this job"});

        job.isClosed=!job.isClosed;
        await job.save();
        res.json({message:"Job status updated successfully!"});
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}