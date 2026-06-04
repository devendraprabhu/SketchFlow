import React, { useEffect, useState } from 'react'
import { supabase } from "../supabase"
import { useNavigate } from 'react-router-dom'
import { Label, FileInput } from 'flowbite-react'



const Dashboard = () => {
  const [userName, setuserName] = useState(" ")
    const navigate = useNavigate();
    const handlelogout = async () =>{
        await supabase.auth.signOut()
        console.log("logged out");
        navigate("/")
      }
    const username= async() =>{
      const data = await supabase.auth.getUser()
      setuserName(data.data.user.user_metadata.full_name)
      console.log(userName)
    }
    useEffect(()=>{
      username()
    },[])
  return (
    <div>
      <nav className='mx-auto px-6 py-5 flex items-center justify-between bg-black text-white backdrop-blur-2xl'>
        <div>
          <div>
            <h1 className='text-4xl tracking-tight'>SketchFlow</h1>
          </div>
        </div>
        <div className=''>
          <div>
            <button onClick={handlelogout} className='bg-white text-black px-4 py-2 rounded-lg  font-medium cursor-pointer text-2xl hover:bg-black hover:text-white hover:border-2 hover:border-white transition'>LOGOUT</button>
          </div>
        </div>
      </nav>

      <div className='mt-5'>
         <h1 className='text-center text-3xl'>Welcome Back {userName} 👍</h1>
      </div>

      <div>
        <div className="flex w-full items-center justify-center">
      <Label
        htmlFor="dropzone-file"
        className="flex h-64 w-4xl mt-20 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-black border-dotted  "
      >
        <div className="flex flex-col items-center justify-center pb-6 pt-5">
          <svg
            className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 ">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
        </div>
        <FileInput id="dropzone-file" className="hidden" />
      </Label>
    </div>
      </div>
      <div>
        <h3 className='text-center text-2xl mt-5 ' >Recent</h3>
      </div>

    </div>
  ) 
}

export default Dashboard