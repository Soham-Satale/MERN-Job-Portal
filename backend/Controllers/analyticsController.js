import Job from "../models/Job.js";
import Application from "../models/Application.js";

const getTrend=(curr,prev)=>{
    if(prev===0) return curr>0 ? 100:0;
    return Math.round(((curr-prev)/prev)*100);
}

export const getEmployerAnalytics=async(req,res)=>{
    try{
        if(req.user.role!=='employer') return res.status(403).json({message:"Access denied"});

        const companyId=req.user._id;

        const now=new Date();
        const last7Days=new Date(now);
        last7Days.setDate(now.getDate()-7);

        const prev7Days=new Date(now);
        prev7Days.setDate(now.getDate()-14);

     //counts//
        const totalActiveJobs=await Job.countDocuments({company:companyId,isClosed:false});
        const jobs=await Job.find({company:companyId}).select("_id").lean();
        const jobIds=jobs.map(job=>job._id);

        const totalApplications=await Application.countDocuments({job:{$in:jobIds}});
        const totalHired=await Application.countDocuments({job:{$in:jobIds},status:"Accepted"});
    
     
    //Trends

    //Active Job posts trend

    const activeJobsLast7=await Job.countDocuments({company:companyId,createdAt:{$gte:last7Days,$lte:now}});
    const activeJobsPrev7=await Job.countDocuments({company:companyId,createdAt:{$gte:prev7Days,$lte:last7Days}});

    const activeJobsTrend=getTrend(activeJobsLast7,activeJobsPrev7);

    //Applications trend
    const applicationsLast7=await Application.countDocuments({job:{$in:jobIds},createdAt:{$gte:last7Days,$lte:now}});
    const applicationsPrev7=await Application.countDocuments({job:{$in:jobIds},createdAt:{$gte:prev7Days,$lte:last7Days}});

    const applicationsTrend=getTrend(applicationsLast7,applicationsPrev7);

    //Hired trend
    const hiredLast7=await Application.countDocuments({job:{$in:jobIds},status:"Accepted",createdAt:{$gte:last7Days,$lte:now}});
    const hiredPrev7=await Application.countDocuments({job:{$in:jobIds},status:"Accepted",createdAt:{$gte:prev7Days,$lte:last7Days}});

    const hiredTrend=getTrend(hiredLast7,hiredPrev7);

    //DATA

    const recentJobs=await Job.find({company:companyId})
    .sort({createdAt:-1})
    .limit(5)
    .select("title location type createdAt isClosed");

    const recentApplications=await Application.find({job:{$in:jobIds}})
    .sort({createdAt:-1})
    .limit(5)
    .populate("applicant","name email avatar")
    .populate("job","title");

    res.json({
        counts:{
            totalActiveJobs,
            totalApplications,
            totalHired
        },
        trends:{
            activeJobsTrend,
            applicationsTrend,
            hiredTrend
        },
        data:{
            recentJobs,
            recentApplications
        }
    })


    }
    catch(err){
        res.status(500).json({message:"Failed to get analytics",error:err.message});
    }
}