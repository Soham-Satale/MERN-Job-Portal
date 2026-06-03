import React from 'react'
import {motion} from 'framer-motion'
import{ Mail,Lock,Eye,EyeOff,Loader,AlertCircle,CheckCircle} from 'lucide-react'
import { validateEmail } from '../../utils/helper.js'
import {useAuth} from '../../context/AuthContext'
import axiosInstance from '../../utils/axiosInstance.js'
import { API_PATHS } from '../../utils/apiPaths.js';

const Login = () => {

    const {login}=useAuth();
    const[formdata,setFormData] = React.useState({
        email:'',
        password:'',
        rememberMe:false
    });

    const[formState,setFormState] = React.useState({
        loading:false,
        errors:{},
        success:false,
        showPassword:false
    });

    //validate email functions


    const validatePassword = (password) => {
        if(!password) return 'Password is required';
        return null;
    }

    //handle input changes
    const handleInputChange = (e) => {
        const{name,value}=e.target;
        setFormData(prev=>({
            ...prev,
            [name]:value
        }));

        //clear error when user starts typing
        if(formState.errors[name]){
            setFormState(prev=>({
                ...prev,
                errors:{
                    ...prev.errors,
                    [name]:null
                }
            }))
        }
    }
    
    const validateForm = () => {
        const errors={
            email: validateEmail(formdata.email),
            password: validatePassword(formdata.password)
        }

        //remove empty errors
        Object.keys(errors).forEach(key=>{
            if(!errors[key]) delete errors[key];
            });

        setFormState(prev=>({
            ...prev,
              errors
        }))

        return Object.keys(errors).length === 0;
     

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!validateForm()){
            return;
        }

         setFormState(prev=>({
        ...prev,
        loading:true
        }));

        try{
            //Login API integration
            const response=await axiosInstance.post(API_PATHS.AUTH.LOGIN,{
                email:formdata.email,
                password:formdata.password,
                rememberMe:formdata.rememberMe
            });

            //just to test
            console.log(response.data);

            setFormState(prev=>({
                ...prev,
                loading:false,
                success:true,
                errors:{}
            }));

            const {token,role}=response.data;
            if(token){
                login(response.data,token);

                //Redirect based on role
                // setTimeout(()=>{
                //     window.location.href= 
                //     role==='employer'?'/employer-dashboard':'/find-jobs';
                // },2000);
            }

            //Redirect based on user role
            setTimeout(()=>{
                const redirectPath= role==='employer'?'/employer-dashboard':'/find-jobs';
                window.location.href=redirectPath;
            },1500);
        }
        catch(error){
            setFormState(prev=>({
                ...prev,
                loading:false,
                errors:{
                    submit:error.response?.data?.message || 'Login failed. Please check your credentials.'
                }
            }));
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
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back!</h2>
            <p className='text-gray-600 mb-4'>
                You have been successfully logged in.
            </p>
            <div className='animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto'></div>
            <p className='text-sm text-gray-500 mt-2'>Redirecting to your dashboard...</p>
        </motion.div>
    </div>
    )
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 px-4 '>
      <motion.div
        className='bg-white p-8 rounded-xl shadow-lg max-w-md w-full'
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.5}}

      >
        <div className='text-center mb-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Welcome Back</h2>
            <p className='text-gray-600'>Sign in to your JobPortal account</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Email Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                </label>
                <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 text-gray-500 -translate-y-1/2 w-5 h-5'/>
                    <input 
                        type='email' 
                        name='email' 
                        value={formdata.email} 
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 rounded-lg border 
                            ${formState.errors.email? 'border-red-500':'border-gray-300'}
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`
                        }
                        placeholder='enter your email'
                    />
                </div>
                {formState.errors.email && 
                (<p className='text-red-500 text-sm mt-1 flex items-center'>
                    <AlertCircle className='w-4 h-4 mr-1'/>
                    {formState.errors.email}
                </p>
                )}
            </div>

            {/* Password Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                </label>
                <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 text-gray-500 -translate-y-1/2 w-5 h-5'/>
                    <input 
                    type={formState.showPassword? 'text':'password'}
                    name='password' 
                    value={formdata.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border
                        ${formState.errors.password? 'border-red-500':'border-gray-300'}
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`  
                    }
                    placeholder='enter your password'
                    />
                    <button
                    type='button'
                    onClick={()=> setFormState(prev=>({
                        ...prev,showPassword: !prev.showPassword
                    } ))}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'
                    >
                        {formState.showPassword? <EyeOff className='w-5 h-5'/> : <Eye className='w-5 h-5'/>}
                    </button>
                </div>
                {formState.errors.password && 
                (<p className='text-red-500 text-sm mt-1 flex items-center'>
                    <AlertCircle className='w-5 h-5 mr-1'/>
                    {formState.errors.password}
                </p>
                )}
            </div>

            {/*submit error*/}
            {formState.errors.submit && (
                <div className='bg-red-50 border border-red-200 p-3 rounded-lg '>
                    <p className='text-red-700 text-sm flex items-center'>
                    <AlertCircle className='w-5 h-5 mr-2'/>
                    {formState.errors.submit}
                    </p>
                </div>
            )}

            {/*submit button*/}
            <button 
            type='submit'
            disabled={formState.loading} 
            className='w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
            >
                {formState.loading?(
                    <>
                    <Loader className='w-5 h-5 animate-spin'/>
                    <span>Signing In...</span>
                    </>
                    ) : (<span>Sign In</span> )
                }
                
            </button>


            {/* sign up link */}
            <div className='text-center'>

                <p className='text-gray-600'>
                    Don't have an account?{' '}
                    <a href="/signup" className='text-blue-600 hover:text-blue-700 font-medium'>
                    Create One here
                    </a>
                </p>
            </div>

        </form>
        
      </motion.div>
    </div>
  )
}

export default Login
