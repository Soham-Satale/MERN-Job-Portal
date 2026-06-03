import React,{useState} from 'react'
import { User, Upload, Building2, UserCheck, Mail, Lock, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { validateEmail,validatePassword,validateAvatar} from '../../utils/helper'
import uploadImage from '../../utils/uploadimage'
import { useAuth } from '../../context/AuthContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

const SignUp = () => {

  const {login}=useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    avatar: null
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    success: false,
    showPassword: false,
    avatarPreview: null
  });

  //Handle input changes
  const handleInputChange = (e) => {

    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    //clear error when user starts typing
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: null
        }
      }))
    }
  }

  const handleChange=(role)=>{
    setFormData(prev=>({...prev,role}));
    if(formState.errors.role){
      setFormState(prev=>({
        ...prev,
        errors:{...prev.errors,role:null}
      }))
    }
  }

  const handleAvatarChange=(e)=>{
    const file=e.target.files[0];
    if(file){
      const error=validateAvatar(file);
      if(error){
        setFormState(prev=>({
          ...prev,
          errors:{...prev.errors,avatar:error}
        }));
        return;
      }
      setFormData(prev=>({...prev,avatar:file}));

      //create preview
      const reader=new FileReader();
      reader.onload=()=>setFormState(prev=>({
        ...prev,
        avatarPreview:reader.result
      }));

      reader.readAsDataURL(file);
    }
  }

  const validateform=()=>{
    const errors={
      fullName:!formData.fullName?'Enter full name':null,
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role:!formData.role?'Select a role':null,
      avatar:''
    };

    //remove empty errors
    Object.keys(errors).forEach(key => {
      if (!errors[key]) delete errors[key];
    });

    setFormState(prev => ({
      ...prev,
      errors
    }));

    return Object.keys(errors).length === 0;
  }

  const handlesubmit=async(e)=>{
    e.preventDefault();
    if(!validateform()){ return;}

    setFormState(prev=>({...prev,loading:true}));

    try{
      //signup api integration
      let avatarUrl="";

      //upload image if present
      if(formData.avatar){
        const imgUploadRes=await uploadImage(formData.avatar);
        avatarUrl=imgUploadRes.imageurl || '';
      }

      const response=await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name:formData.fullName,
        email:formData.email,
        password:formData.password,
        role:formData.role,
        avatar:avatarUrl || ''
      })

      //handle successful registration
      setFormState(prev=>({
        ...prev,
        loading:false,
        success:true,
        errors:{}
      }));

      const {token}=response.data;

      if(token){
        login(response.data,token);

        //redirect based on role
        setTimeout(()=>{
          window.location.href=
          formData.role === 'employer' ? '/employer-dashboard' : '/find-jobs';
        },2000)

      }
    }
    catch(error){

      setFormState(prev=>({...prev,
        loading:false,
        errors:{submit:error.response?.data?.message || 'Signup failed. Please try again.'}}));
    }

  }


  if(formState.success){
    return(
        <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
        <motion.div
            initial={{opacity:0,scale:0.9}}
            animate={{opacity:1,scale:1}}
            className='bg-white p-8 rounded-lg max-w-md w-full text-center'
        >
            <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4'/>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Account Created!</h2>
            <p className='text-gray-600 mb-4'>
                Welcome to JobPortal! Your account has been successfully created.
            </p>
            <div className='animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto'></div>
            <p className='text-sm text-gray-500 mt-2'>Redirecting to your dashboard...</p>
        </motion.div>
    </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8'>
      <motion.div 
      initial={{opacity:0,y:20}}
      animate={{opacity:1,y:0}}
      transition={{duration:0.6}}
      className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">

        <div className='text-center mb-8'>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Create Account
          </h2>
          <p className='text-gray-600 text-sm'>
            Join thousands of professionals finding their dream jobs
          </p>
        </div>

        <form onSubmit={handlesubmit} className='space-y-6'>
          {/* Full Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2' >
              Full Name
            </label>
            <div className='relative'>
              <User className='absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 w-5 h-5'/>
              <input 
              type="text" 
              name='fullName'
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border 
                ${formState.errors.fullName ? 'border-red-500' : 'border-gray-300'}
                focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors`}
                placeholder='Enter your full name'
              />   
            </div>
            {formState.errors.fullName && 
            <p className='text-red-500 text-sm flex items-center mt-1'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.fullName}
            </p>
            }
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2' >
              Email Address
            </label>
            <div className='relative'>
              <Mail className='absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 w-5 h-5'/>
              <input 
              type="email" 
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border 
                ${formState.errors.email ? 'border-red-500' : 'border-gray-300'}
                focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors`}
                placeholder='Enter your email'
              />   
            </div>
            {formState.errors.email && 
            <p className='text-red-500 text-sm flex items-center mt-1'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.email}
            </p>
            }
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2' >
              Password
            </label>
           <div className='relative'>
              <Lock className='absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400 w-5 h-5'/>
              <input 
              type={formState.showPassword ? 'text' : 'password'} 
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border 
                ${formState.errors.password ? 'border-red-500' : 'border-gray-300'}
                focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors`}
                placeholder='Create a strong password'
              />   
           
            <button
            type='button'
            onClick={()=>
              setFormState(prev => ({
                ...prev,
                showPassword: !prev.showPassword
              }))
            }
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
            >
              {formState.showPassword ?
              ( <EyeOff className='w-5 h-5'/> ):
              ( <Eye className='w-5 h-5'/> )
              }
            </button>
           </div>
          

          {formState.errors.password && 
          <p className='text-red-500 text-sm flex items-center mt-1'>
            <AlertCircle className='w-4 h-4 mr-1'/>
            {formState.errors.password}
          </p>
          }
          </div>

          {/* Avatar Upload */ }
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture(Optional)
            </label>
            <div className='flex items-center space-x-4'>
              <div className='w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden'>
                {formState.avatarPreview ? (
                  <img
                    src={formState.avatarPreview}
                    alt="Avatar Preview"
                    className="w-full h-full object-cover"
                  /> 
                ) : (
                  <User className='w-8 h-8 text-gray-400'/>
                )                        
                }
              </div>

              <div className='flex-1'>
                <input
                  type="file"
                  id='avatar'
                  name="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className='hidden'
                />
                <label 
                htmlFor="avatar"
                className='cursor-pointer bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2'
                >
                  <Upload className='w-4 h-4'/>
                  <span>Upload Photo</span>

                </label>
                <p className='text-xs text-gray-500 mt-1'>JPG,PNG upto 5MB</p>
              </div>
            </div>
            {formState.errors.avatar && 
            <p className='text-red-500 text-sm flex items-center mt-1'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.avatar}
            </p>
            }
          </div>


          {/*Role Selection*/}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-3'>
              I am a *
            </label>
            <div className='grid grid-cols-2 gap-4'>
              <button 
              type='button'
              onClick={()=>
                handleChange('jobseeker')   
              }
              className={`p-4 rounded-lg border-2 transition-all 
                ${formData.role === 'jobseeker' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-300'
                }
              `}
              >
                <UserCheck className='w-8 h-8 mx-auto mb-2'/>
                <div className='font-medium'>Job Seeker</div>
                <div className='text-xs'>
                  Looking for opportunities
                </div>
              </button>

              <button
              type='button'
              onClick={()=>handleChange('employer')}
              className={`p-4 rounded-lg border-2 transition-all 
                ${formData.role === 'employer' 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-300 hover:border-gray-300'
                }
              `}
              >
                <Building2 className='w-8 h-8 mx-auto'/>
                <div className='font-medium'>Employer</div>
                <div className='text-xs text-gray-500'>Hiring talent</div>

              </button>
            </div>

            {formState.errors.role && 
            <p className='text-red-500 text-sm flex items-center mt-1'>
              <AlertCircle className='w-4 h-4 mr-1'/>
              {formState.errors.role}
            </p>
            }
          </div>


          {/*Submit Error*/}
          {formState.errors.submit && (
            <div className='bg-red-50 border border-red-200 rounded-lg p-3'>
              <p className='text-red-700 text-sm flex items-center'>
                <AlertCircle className='w-4 h-4 mr-2'/>
                {formState.errors.submit}
              </p>
            </div>
          )
          }

          {/*Submit Button*/}
          <button
          type='submit'
          disabled={formState.loading}
          className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
          >
            {formState.loading ? (
              <>
                <Loader className='w-5 h-5 animate-spin'/>
                <span>Creating Account...</span>
              </>
            ):(
              <span>Create Account</span>
            )}
          </button>

          {/*Login Link*/}
          <div className='text-center'>
            <p className='text-gray-600'>
              Already have an account?{' '}
              <a 
              href="/login"
              className='text-blue-600 hover:text-blue-700 transition-colors font-medium'
              >
                Sign in here
              </a>
            </p>
          </div>



        </form>

      </motion.div>
    </div>
  )
}

export default SignUp
