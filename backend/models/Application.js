import mongoose from "mongoose";

const applicationSchema=new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    resume:{
        type:String //can store uploaded version or link
    },
    status: {
        type: String,
        enum: ['Applied', 'Rejected', 'In Review', 'Accepted'],
        default: 'Applied'
    },

}
, {timestamps: true});

export default mongoose.model("Application", applicationSchema);