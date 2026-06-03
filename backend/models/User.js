import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim:true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim:true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
        },
        role:{
            type: String,
            enum:['jobseeker','employer'],
            required: true,
        },
        avatar:String,
        resume:String,

        //for employer
        companyName:String,
        companyDescription:String,
        companyLogo:String,
    },{
        timestamps: true,
    }
);

//encrypt password before save
userSchema.pre("save", async function () {
    if (!this.isModified("password")) { return;}
    this.password = await bcrypt.hash(this.password, 10);;
  });

  //match entered password
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

export default mongoose.model("User", userSchema);