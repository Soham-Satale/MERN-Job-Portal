import mongoose from "mongoose";

const jobSchema=new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true
    },
    description: {
        type: String,
        required: true,
        trim:true
    },
    requirements: {
        type: String,
        required: true,
        trim:true
    },
    location: {
        type: String,
    },
    category: {
        type: String,
    },
    company: { //Employer
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    salaryMin: {
        type: Number,
        required: true,
    },
    salaryMax: {
        type: Number,
        required: true,
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    type:{
        type: String,
        enum:['Full-Time','Part-Time','Contract','Internship'],
        required: true
    }
},
  {timestamps:true}
);

export default mongoose.model("Job", jobSchema);