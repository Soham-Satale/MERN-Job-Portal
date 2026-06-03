import React,{ useState,useEffect} from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { AlertCircle,MapPin,DollarSign,Briefcase,Users,Eye,Send } from 'lucide-react'
import { API_PATHS } from '../../utils/apiPaths'
import {useLocation,useNavigate} from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { CATEGORIES,JOB_TYPES } from '../../utils/data'
import { toast } from 'react-hot-toast'
import InputField from '../../components/input/InputField'
import SelectField from '../../components/input/SelectField'
import TextareaField from '../../components/input/TextareaField'

const JobPostingForm = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const jobId=location.state?.jobId || null

  const [formData,setFormData]=useState({
    jotitle:'',
    location:'',
    category:'',
    jobType:'',
    description:'',
    requirements:'',
    salaryMin:'',
    salaryMax:''
  })

  const [errors,setErrors]=useState({})
  const [isSubmitting,setIsSubmitting]=useState(false)
  const [isPreview,setIsPreview]=useState(false)

  const handleInputChange=(field,value)=>{
    setFormData(prev=>({
      ...prev,
      [field]:value,
    }))

    //clear error when user starts typing
    if(errors[field]){
      setErrors(prev=>({
        ...prev,
        [field]:null,
      }))
    }
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    const validationErrors=validateForm(formData)
    if(Object.keys(validationErrors).length>0){
      setErrors(validationErrors)
      return;
    }
    setIsSubmitting(true);

    const jobPayload={
      title:formData.joTitle,
      location:formData.location,
      category:formData.category,
      type:formData.jobType,
      description:formData.description,
      requirements:formData.requirements,
      salaryMin:formData.salaryMin,
      salaryMax:formData.salaryMax,
    }
    try{
      const response=jobId
      ? await axiosInstance.put(API_PATHS.JOBS.UPDATE_JOB(jobId),jobPayload)
      : await axiosInstance.post(API_PATHS.JOBS.POST_JOB,jobPayload);

      if(response.status===200 || response.status===201){
        toast.success(
          jobId
          ? 'Job updated successfully'
          : 'Job posted successfully'
        )
        setFormData({
          jotitle:'',
          location:'',
          category:'',
          jobType:'',
          description:'',
          requirements:'',
          salaryMin:'',
          salaryMax:'',
        })
        navigate('/employer-dashboard')
        return;
      }
      console.error("unexpected response",response);
    }
    catch(error){
      if(error.response?.data?.message){
        toast.error(error.response.data.message)
      } else {
        toast.error("Something went wrong")
      }
    }
    finally{
      setIsSubmitting(false);
    }
  }
        
      

  //Form valudation helper function

  const validateForm=(formdata)=>{
    const errors={}
    if(!formdata.jotitle.trim()) errors.jotitle='Job title is required'
    if(!formdata.location) errors.location='Job location is required'
    if(!formdata.category) errors.category='Job category is required'
    if(!formdata.jobType) errors.jobType='Job type is required'
    if(!formdata.description.trim()) errors.description='Job description is required'
    if(!formdata.requirements.trim()) errors.requirements='Job requirements are required'
    if(!formdata.salaryMin || !formdata.salaryMax){
      errors.salary='Salary range is required'
    } else if(parseInt(formdata.salaryMin)>=parseInt(formdata.salaryMax)){
      errors.salary='Minimum salary should be less than maximum salary'
    }

    return errors;
  }

  const isFormValid=()=>{
    const validationErrors=validateForm(formData)
    return Object.keys(validationErrors).length===0
  }

  if(isPreview){
    return (
      <DashboardLayout activeMenu="post-job">
        <JobPostingPreview formData={formData} setIsPreview={setIsPreview}/>
      </DashboardLayout>
    )
  }


  return (
    <DashboardLayout activeMenu="post-job">
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white shadow-xl rounded-2xl p-6'>
            <div className='flex items-center justify-between mb-8'>
              <div>
                <h2 className='text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 text-transparent bg-clip-text'>
                  Post a New Job
                </h2>
                <p className='text-sm text-gray-600 mt-1'>
                  Fill out the form below to create your job posting
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <button
                className='group flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-600 hover:text-white/50 hover:bg-gradient-to-r hover: from-blue-500 hover: to-blue-600 border bordergray-200 hover:border-transparent rounded-xl transition-all duration-300 shadow-lg shadow-gray-100 hover:shadow-xl transform hover:-translate-y-0.5'
                onClick={()=>setIsPreview(true)}
                disabled={!isFormValid()}
                >
                  <Eye className='h-4 w-4 transition-tranform group-hover:-translate-x-1'/>
                  <span>Preview</span>

                </button>

              </div>
            </div>

            <div className='space-y-6'>
              {/* Job Title */}
              <InputField
              label="Job Title"
              id="joTitle"
              placeholder="e.g. Senior Software Engineer"
              value={formData.jotitle}
              onChange={(e)=>handleInputChange('jotitle',e.target.value)}
              error={errors.joTitle}
              required
              icon={Briefcase}
              />

              {/* Location & Remote*/}
              <div className='space-y-4'>
                <div className='flex flex-col sm:flex-row sm:items-end sm:space-x-4 space-y-4 sm:space-y-0'>
                  <div className='flex-1'>
                    <InputField
                    label="Location"
                    id="location"
                    placeholder="e.g. New York, NY"
                    value={formData.location}
                    onChange={(e)=>handleInputChange('location',e.target.value)}
                    error={errors.location}
                    required
                    icon={MapPin}
                    />

                  </div>
                </div>
              </div>

              {/* Category & Job Type */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <SelectField
                label="Category"
                id="category"
                options={CATEGORIES}
                value={formData.category}
                onChange={(e)=>handleInputChange('category',e.target.value)}
                error={errors.category}
                required
                placeholder="Select job category"
                icon={Users}
                />
                <SelectField
                label="Job Type"
                id="jobType"
                options={JOB_TYPES}
                value={formData.jobType}
                onChange={(e)=>handleInputChange('jobType',e.target.value)}
                error={errors.jobType}
                required
                placeholder="Select job type"
                icon={Briefcase}
                />
              </div>

              {/*Description*/}
              <TextareaField
              label="Job Description"
              id="description"
              placeholder="Describe the job role and responsibilities"
              value={formData.description}
              onChange={(e)=>handleInputChange('description',e.target.value)}
              error={errors.description}
              required
              helperText='Include key responsibilities, day-to-day tasks, and what makes this role exciting'
              />

              {/*Requirements*/}
              <TextareaField
              label="Requirements"
              id="requirements"
              placeholder="List key qualifications and skills..."
              value={formData.requirements}
              onChange={(e)=>handleInputChange('requirements',e.target.value)}
              error={errors.requirements}
              required
              helperText='Include required skills, experience level, education, and any preferred qualifications.'
              />

              {/*Salary ranges*/}
              <div className='space-y-2'>
                <label className='block text-sm font-medium text-gray-700'>
                  Salary Range <span className='text-red-500'>*</span>
                </label>
                <div className='grid grid-cols-3 gap-3'>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-gray-400'/>
                    </div>
                    <input 
                    type="number"
                    placeholder="Min"
                    value={formData.salaryMin}
                    onChange={(e)=>handleInputChange('salaryMin',e.target.value)}
                    className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-colors duration-200'
                    /> 
                  </div>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10'>
                      <DollarSign className='h-5 w-5 text-gray-400'/>
                    </div>
                    <input 
                    type="number" 
                    placeholder="Max"
                    value={formData.salaryMax}
                    onChange={(e)=>handleInputChange('salaryMax',e.target.value)}
                    className='w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 focus:border-blue-500 transition-colors duration-200'
                    />
                  </div>
                </div>
                {errors.salary && (
                  <div className='flex items-center space-x-1 text-sm text-red-600'>
                    <AlertCircle className='h-4 w-4'/>
                    <span>{errors.salary}</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className='pt-2'>
                <button
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid()}
                className='w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed outline-none transition-colors duration-200'
                >
                  {isSubmitting ? (
                    <>
                    <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'>
                      Publishing Job...
                    </div>
                    </>
                  ) : (
                    <>
                    <Send className='h-5 w-5 mr-2'/>
                    Publish Job
                    </>
                  )
                }

                </button>
              </div>


            </div>

            
          </div>
    
        </div>
      </div>
    </DashboardLayout>
  )
}

export default JobPostingForm
