import React, { useEffect, useState } from 'react'
import { supabase } from "../supabase"
import { useNavigate } from 'react-router-dom'
import { Label, FileInput } from 'flowbite-react'
import { LogOut, Settings, ArrowRight, Loader2, AlertCircle,Video , Link,MessageSquare,Hash,Zap } from 'lucide-react';
import { TextAlignStart } from 'lucide-react';
import UpgradeButton from './Pricing'

const Dashboard = () => {
  const [userName, setuserName] = useState("")
  const [image, setimage] = useState("")
  const [preview, setpreview] = useState(null)
  const [file, setfile] = useState(null)
  const [result, setresult] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isPro, setIsPro] = useState(false);
 const [credits, setcredits] = useState(0);
  const navigate = useNavigate();

  const goback = () => {
    setpreview(null)
    setfile(null)
    setErrorMessage("")
    setresult("")
  }

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if(selectedFile){
      const data = URL.createObjectURL(selectedFile)
      setpreview(data)
      setfile(selectedFile)
      setErrorMessage("")
    }
  }

  const handleGenerateCode = async () => {
    if(!file){
      return alert("Please Upload a file First")
    }
    
    if (file.size > 50 * 1024 * 1024) {
    alert("File is too large! Please upload an MP4 under 50MB.");
    event.target.value = null; // resets the input
    return;
  }

    if(credits <= 0){
      setErrorMessage("You are out of credits ! Please Upgrade to generate more")
      return;
    }



    setLoading(true)
    setErrorMessage("")
    setresult("")
    setLoadingMessage("Uploading video to secure storage...")

    const filename = `${Date.now()}-${file.name}`
    const {error} = await supabase.storage.from('flowstate-image').upload(filename, file)
    
    if(error){
      console.log(error)
      setLoading(false)
      setErrorMessage("Failed to upload video to storage.")
      return;
    }

    const {data} = supabase.storage.from('flowstate-image').getPublicUrl(filename)
    
    if(data){
      const { data: authData } = await supabase.auth.getUser();
      const { data: insertedData, error:dbError } = await supabase.from('projects').insert({
        project_name: filename,
        image_url: data.publicUrl,
        user_id: authData.user.id
      }).select()

      if(dbError){
        console.log(dbError)
        setLoading(false)
        setErrorMessage("Failed to initialize project in database.")
        return;
      }
      
      const projectId = insertedData[0].id;
      setLoadingMessage("AI is processing transcription & generating posts... (This takes a few seconds)")

      try {
        const airesponse = await fetch("https://flowstatebackend-production.up.railway.app/api/transcribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              video_url: data.publicUrl
            })
          })

         if (!airesponse.ok) {
           throw new Error("AI engine is currently over capacity. Please try again in a few moments.")
         }

         const aiData = await airesponse.json()
         
         await supabase.from("projects").update({
          generated_code: JSON.stringify(aiData)
         }).eq("id", projectId)

         const updateCredits =  credits-1

         const {error : creditError} = await supabase.from("profiles").update({
          credits: updateCredits
         }).eq("id", authData.user.id)

         if(!creditError){
          setcredits(updateCredits)
         }
         else{
          console.log(creditError)
         }

         
         setresult(aiData)
         setLoading(false)
        }
      catch (e) {
        console.log(e)
        setLoading(false)
        setErrorMessage(e.message || "Something went wrong with the AI generation. Please retry.")
      }
    }
  }

  const handlelogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const username = async() => {
    const { data } = await supabase.auth.getUser()
    if(data.user){
      setuserName(data.user.user_metadata.full_name)
      setimage(data.user.user_metadata.avatar_url)
    }
  }

 const fetchUserCredits = async () =>{
  const { data: authData } = await supabase.auth.getUser();
    if(authData.user){
      const {data: ProfileData,error}= await supabase.from("profiles").select('credits').eq('id',authData.user.id).single()
      if(ProfileData){
        setcredits(ProfileData.credits)
      }
      else if (error){
        console.log(error)
        
      }
    }


 }

  const history = () => {
    navigate("/history")
  }
  const pricing= () =>{
    navigate("/pricing")
  }

  useEffect(() => {
    username()
  }, [])

  useEffect(()=>{
    fetchUserCredits()
  },[])

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 transition-colors duration-200">
      <nav className='w-full px-6 py-4 box-border flex items-center justify-between bg-white text-black backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-40'>
        <div className='flex items-center gap-10'>
          <div>
            <h1 className="text-2xl tracking-tight font-['Bebas_Neue']">Flowstate</h1>
          </div>
          <ul className='flex items-center gap-5 font-medium'>
            <li className='hover:underline text-gray-500 hover:text-black cursor-pointer' onClick={history}>History</li>
            <li className='hover:underline text-gray-500 hover:text-black cursor-pointer'onClick={pricing}>Upgrade</li>
          </ul>
        </div>
        
        <div className='flex items-center gap-4'>
         <span className='flex gap-2 p-2  font-medium '><Zap size={25}  /> {credits} </span>
          <img src={image} alt="User Profile" referrerPolicy='no-referrer' className='rounded-full w-10 h-10 object-cover' /> <span className='text-gray-500 font-medium'>{userName}</span>
          <button onClick={handlelogout} className='bg-white text-black px-3 py-2 rounded-lg font-medium cursor-pointer text-sm hover:bg-black hover:text-white border border-transparent hover:border-white transition'><LogOut size={18} /></button>
        </div>
      </nav>

      <main className='w-full max-w-7xl mx-auto px-6 py-8'>
        <div className='mb-10'>
           <h1 className="text-3xl font-['Roboto'] font-medium mb-1">Welcome Back {userName} 👍</h1>
           <p className="text-gray-500 text-base font-['Roboto'] font-light">Ready to get started?</p>
        </div>

        {errorMessage && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 shadow-sm">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <div className="text-sm font-medium">{errorMessage}</div>
          </div>
        )}

        <div className='w-full mb-16'>
         {preview ? ( 
          <div className='flex flex-col lg:flex-row gap-8 items-start w-full'>
            <div className='w-full lg:w-[40%] bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4'>
              <video
                src={preview}
                controls
                className='w-full rounded-lg shadow-md h-200 bg-black object-fit'
                autoPlay
                loop
                muted
                preload="metadata"
              />
              
              {loading ? (
                <div className="flex flex-col items-center gap-2 bg-white px-8 py-4 rounded-xl border border-gray-100 shadow-sm">
                  <Loader2 className="animate-spin text-blue-500" size={28} />
                  <p className="text-sm font-medium text-gray-600 text-center animate-pulse">{loadingMessage}</p>
                </div>
              ) : (
                <div className='flex flex-col sm:flex-row items-center justify-center gap-4 w-full'>
                  <button className='w-full bg-black text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-600 transition flex items-center justify-center gap-2' onClick={handleGenerateCode}>Generate Content <ArrowRight /> </button>
                  <button className='w-full bg-white text-black border border-gray-300 px-4 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-600 transition flex items-center justify-center gap-2' onClick={goback}>Choose Another</button>
                </div>
              )}
            </div>

            <div className='w-full lg:w-[60%] space-y-6'>
              {result ? (
                <div className="space-y-6 w-full">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h2 className="font-bold text-xl mb-2 text-gray-500 font-['Geist'] flex gap-2.5"> <TextAlignStart size={25}/> Transcript</h2>
                    <p className="text-gray-700 leading-relaxed text-sm font-['Geist'] font-medium">{result.transcript}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h2 className="font-bold text-xl mb-2 font-['Geist'] flex gap-2.5"> <Video size={25} />YouTube Title</h2>
                    <p className="text-gray-700 leading-relaxed text-sm font-['Geist'] font-medium">{result.content.youtube_title}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h2 className="font-bold text-xl mb-2 font-['Geist']">Description</h2>
                    <p className="text-gray-700 leading-relaxed text-sm font-['Geist'] font-medium">{result.content.youtube_description}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h2 className="font-bold text-xl mb-2 font-['Geist'] flex gap-2.5"> <Link size={25} /> LinkedIn Post</h2>
                    <p className="text-gray-700 leading-relaxed text-sm font-['Geist'] font-medium">{result.content.linkedin_post}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h2 className="font-bold text-xl mb-2 font-['Geist'] flex gap-2.5"> <MessageSquare size={23} /> X Post</h2>
                    <p className="text-gray-700 leading-relaxed text-sm font-['Geist'] font-medium">{result.content.x_post}</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <h2 className="font-bold text-xl mb-2 font-['Geist'] flex gap-2.5"> <Hash size={24} /> Hashtags</h2>
                    <a className="text-gray-700 leading-relaxed text-sm font-['Geist'] font-medium">{result.content.hashtags}</a>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-white text-gray-400 font-medium text-sm">
                  Your generated content will appear here
                </div>
              )}
            </div>
          </div>
         ) : (
           <div className="flex justify-center w-full">
             <Label
              htmlFor="dropzone-file"
              className="flex h-64 w-full max-w-2xl cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 hover:bg-gray-100 transition"
             >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg className="mb-3 h-8 w-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">Mp4</p>
              </div>
              <FileInput id="dropzone-file" className="hidden" onChange={handleFile} accept='video/mp4' />
              <div className="bg-black text-white px-4 py-2 mt-2 rounded-lg font-medium cursor-pointer hover:bg-gray-800 transition">Upload</div>
             </Label>
           </div>
         )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard