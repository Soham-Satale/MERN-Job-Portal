import { Briefcase } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <footer className='relative bg-gray-50 text-gray-900 overflow-hidden'>
        <div className='relative z-10 px-6 py-16'>
            <div className='max-w-6xl mx-auto'>
                {/*main Footer content*/}
                <div className='text-center space-y-8'>
                    {/* Logo and brand */}
                    <div className='space-y-4'>
                        <div className='flex items-center justify-center space-x-2 mb-6'>
                            <div className='w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                                <Briefcase className='w-6 h-6 text-white'/>
                            </div>
                            <h3 className='text-2xl font-bold text-gray-800'>JobPortal</h3>
                        </div>

                        <p className={`text-sm text-gray-600 max-w-md mx-auto`}>
                            Connecting talented professionals with innovative companies
                            worldwide. Your dream job is just a click away.
                        </p>
                    </div>

                    {/*copyright*/}
                    <div className='space-y-2'>
                        <p className='text-sm text-gray-600'>
                            &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
                        </p>
                        <p className=''>
                            Made with <span className='text-red-500'>❤</span> by Soham Satale
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer
