import React, { useEffect, useState } from 'react'
import { supabase } from "../supabase"
import { useNavigate } from 'react-router-dom'
import { Label, FileInput } from 'flowbite-react'
import { LogOut } from 'lucide-react';
import { Settings } from 'lucide-react';
import { ArrowRight } from 'lucide-react';



const Dashboard = () => {
  const [userName, setuserName] = useState(" ")
  const [image, setimage] = useState("")
  const [preview, setpreview] = useState(null)
  const [file, setfile] = useState(null)
  const [result, setresult] = useState("")
  const goback = () =>{
    setpreview(null)
    setfile(null)
  }
  const handleFile= (e)=>{
    const selectedFile = e.target.files[0];
    if(selectedFile){
      const data = URL.createObjectURL(selectedFile)
      setpreview(data)
      setfile(selectedFile)
    }
  }
  const handleGenerateCode = async () =>{
    if(!file){
      return alert("Please Upload a file First")
    }
    const filename = `${Date.now()}-${file.name}`
    const {error}= await supabase.storage.from('flowstate-image').upload(filename,file)
    if(error){
      console.log(error)
      return;
    }
    const {data} = await supabase.storage.from('flowstate-image').getPublicUrl(filename)
    console.log(data.publicUrl)
    if(data){
      const { data: authData } = await supabase.auth.getUser();
      const {error:dbError}=await supabase.from('projects').insert({
        project_name: filename,
        image_url: data.publicUrl,
        user_id: authData.user.id
      })
      if(dbError){
        console.log(dbError)
        return;
      }
      else{
        console.log("Project Created Successfully");
      }
    }

    console.log("sending file to Pytho Backend")
    try{
      const airesponse = await fetch("https://flowstatebackend-production.up.railway.app/api/transcribe",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({
            video_url:data.publicUrl
          })
        })
       const aiData= await airesponse.json()
       console.log(aiData)
       setresult(aiData)
       
      }
    catch (e){
      console.log(e)
    }
    


  }
    const navigate = useNavigate();
    const handlelogout = async () =>{
        await supabase.auth.signOut()
        console.log("logged out");
        navigate("/")
      }
    const username= async() =>{
      const { data } = await supabase.auth.getUser()
      const image = data.user.user_metadata.avatar_url 
      setuserName(data.user.user_metadata.full_name)
      setimage(image)
      console.log(userName)
      console.log(data)
      console.log(data.user.user_metadata.avatar_url)
    }
    useEffect(()=>{
      username()
    },[])
  return (
    <div>
      <nav className='w-full px-6 py-4 box-border flex items-center justify-between bg-white text-black backdrop-blur-2xl'>
        <div className='flex items-center gap-10'>
          <div>
            <h1 className="text-2xl tracking-tight font-['Bebas_Neue']">Flowstate</h1>
          </div>
          <ul className='flex items-center gap-5 font-medium'>
            <li className='hover:underline text-gray-500 hover:text-black cursor-pointer'>Home</li>
            <li className='hover:underline text-gray-500 hover:text-black cursor-pointer'>Projects</li>
            <li className='hover:underline text-gray-500 hover:text-black cursor-pointer'>Models</li>
            <li className='hover:underline text-gray-500 hover:text-black cursor-pointer'>History</li>
          </ul>
          
        </div>
        
        <div className='flex items-center gap-4'>
          <button className='bg-white text-black px-3 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-200'><Settings size={18} /></button>
          <img src={image} alt="User Profile" referrerPolicy='no-referrer' className='rounded-full w-10 h-10 object-cover' /> <span className='text-gray-500 font-medium'>{userName}</span>
          <button onClick={handlelogout} className='bg-white text-black px-3 py-2 rounded-lg font-medium cursor-pointer text-sm hover:bg-black hover:text-white border border-transparent hover:border-white transition'><LogOut size={18} /></button>
        </div>
      </nav>

      <main className='w-full px-6 py-8'>
        <div className='mb-10'>
           <h1 className="text-3xl font-['Roboto'] font-medium mb-1">Welcome Back {userName} 👍</h1>
           <p className="text-gray-500 text-base font-['Roboto'] font-light">Ready to get started?</p>
        </div>

        <div className='flex w-full items-center justify-center mb-16'>
         {preview ? ( 
          <div className='flex items-center justify-center w-full'>
          <div className='flex flex-col gap-4 items-center'>
          <video
                  src={preview}
                  controls
                  className='w-full max-w-2xl rounded-lg'
                  autoPlay
                  loop
                  muted
                  preload="metadata"
                  
                  />
          <div className='flex items-center justify-center gap-4 mt-2'>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-600 transition flex items-center gap-2' onClick={handleGenerateCode}>Generate Content <ArrowRight /> </button>
          <button className='bg-gray-500 text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-600 transition flex items-center gap-2' onClick={goback}>Choose Another One</button>
          </div>
         </div>
         </div>) : 
               <Label
            htmlFor="dropzone-file"
            className="flex h-64 w-full max-w-2xl cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
              <svg
                className="mb-3 h-8 w-8 text-gray-500"
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
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold text-gray-700">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">Mp4,gif,WEBP</p>
            </div>
            <FileInput id="dropzone-file" className="hidden" onChange={handleFile} />
            <div className="bg-black text-white px-4 py-2 mt-2 rounded-lg font-medium cursor-pointer hover:bg-gray-800 transition">Upload</div>
          </Label>
        }
        </div>
          {result && (
  <div className="max-w-4xl mx-auto space-y-6">

    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-bold text-xl mb-2">Transcript</h2>
      <p>{result.transcript}</p>
    </div>

    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-bold text-xl mb-2">YouTube Title</h2>
      <p>{result.content.youtube_title}</p>
    </div>

    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-bold text-xl mb-2">Description</h2>
      <p>{result.content.youtube_description}</p>
    </div>

    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-bold text-xl mb-2">LinkedIn Post</h2>
      <p>{result.content.linkedin_post}</p>
    </div>

    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-bold text-xl mb-2">X Post</h2>
      <p>{result.content.x_post}</p>
    </div>

    <div className="bg-white border rounded-xl p-4">
      <h2 className="font-bold text-xl mb-2">Hashtags</h2>
      <p>{result.content.hashtags}</p>
    </div>

  </div>
)}

        
      </main>
    </div>
  )
}

export default Dashboard