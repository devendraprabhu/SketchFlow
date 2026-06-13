import React, { useEffect, useState } from 'react'
import { supabase } from "../supabase"
import { useNavigate } from 'react-router-dom'
import { LogOut, Settings, Zap } from 'lucide-react';
import ProjectView from './ProjectView'
const History = () => {
  const [userName, setuserName] = useState(" ")
  const [image, setimage] = useState("")
  const [credits, setcredits] = useState(0);
  const [projects, setprojects] = useState([]);
  const [loading, setloading] = useState(true);
  const [selectedProject, setselectedProject] = useState();


  const navigate = useNavigate();

  const handlelogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const projectview = async ()=>{
    navigate("/projectview/")
  }

  const fetchUserData = async () => {
    const { data:authdata } = await supabase.auth.getUser()
    if(authdata?.user){
        setuserName(authdata.user.user_metadata.full_name)
        setimage(authdata.user.user_metadata.avatar_url)

        const {data:projectData,error} = await supabase
          .from("projects")
          .select("*")
          .eq("user_id",authdata.user.id)
          .order("created_at",{ascending:false})
        
        if(error){
          console.log(error)
        } else {
          setprojects(projectData)
          setloading(false)
        }
    }
  }

 const fetchUserCredits = async () =>{
  const { data: authData } = await supabase.auth.getUser();
    if(authData?.user){
      const {data: ProfileData,error}= await supabase.from("profiles").select('credits').eq('id',authData.user.id).single()
      if(ProfileData){
        setcredits(ProfileData.credits)
      }
      else if (error){
        console.log(error)
        
      }
    }
 }

 
  useEffect(() => {
    fetchUserData()
    fetchUserCredits()
  }, [])

  const history = () => navigate("/history")
  const goDashboard = () => navigate("/dashboard")

  return (
    <div>
      <div>
        <nav className='w-full px-6 py-4 box-border flex items-center justify-between bg-white text-black backdrop-blur-2xl border-b border-slate-100 sticky top-0 z-40'>
        <div className='flex items-center gap-10'>
          <div>
            <h1 className="text-2xl tracking-tight font-['Bebas_Neue'] cursor-pointer" onClick={goDashboard}>Flowstate</h1>
          </div>
          <ul className='flex items-center gap-5 font-medium'>
            <li className='hover:underline text-gray-500 hover:text-black cursor-pointer' onClick={goDashboard}>Dashboard</li>
            <li className='hover:underline text-gray-500 hover:text-black cursor-pointer' onClick={history} >History</li>
          </ul>
        </div>
        
        <div className='flex items-center gap-4'>
          <span className='flex gap-2 p-2 font-medium'><Zap size={25}/> {credits} </span>
          <img src={image} alt="User Profile" referrerPolicy='no-referrer' className='rounded-full w-10 h-10 object-cover' /> <span className='text-gray-500 font-medium'>{userName}</span>
          <button onClick={handlelogout} className='bg-white text-black px-3 py-2 rounded-lg font-medium cursor-pointer text-sm hover:bg-black hover:text-white border border-transparent hover:border-white transition'><LogOut size={18} /></button>
        </div>
      </nav>

      </div>
  
      <div>
        <h1 className='font-bold text-4xl m-10'>History</h1>
      </div>

      <div className='w-full flex flex-col gap-4 justify-center items-center mx-auto text-center' >
        {loading && <p className="text-gray-500">Loading Your History......</p>}
        {!loading && projects.length==0 &&(
          <p className="text-gray-500">You havent created any project yet</p>
        )}
        {!loading && projects.map((proj)=>(
           <div key={proj.id} className="w-[800px] bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center gap-4 overflow-hidden"> 
              <video 
                src={proj.image_url}
                className='w-40 h-24 bg-black object-cover rounded-md'
              ></video>
              <span className="font-['Roboto'] font-medium text-left flex-grow truncate px-4">
              {proj.project_name}
            </span>
            <div className='flex items-center gap-4 ml-auto'>
             
              <button className="bg-black text-white px-6 py-2 rounded-lg font-medium cursor-pointer hover:bg-gray-800 transition" onClick={()=>{
                setselectedProject(proj)
              }}>
                View
              </button>
           </div>
           </div> 
        ))}
        
      </div>
      {selectedProject && (
        <ProjectView
          project={selectedProject}
          onClose={() => setselectedProject(null)}
        />
      )}
    </div>
  )
}

export default History