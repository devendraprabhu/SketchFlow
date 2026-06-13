import React, { useEffect, useState } from 'react'
import { supabase } from "../supabase"
import { useNavigate } from 'react-router-dom'
import { Label, FileInput } from 'flowbite-react'
import { LogOut, Settings, ArrowRight, Loader2, AlertCircle,Video , Link,MessageSquare,Hash,Zap } from 'lucide-react';
import { TextAlignStart } from 'lucide-react';
import UpgradeButton from './Pricing'

const DashNav = () => {
    const [userName, setuserName] = useState("")
    const [image, setimage] = useState("")
    const [credits, setcredits] = useState(0);
    const navigate = useNavigate();

     const fetchUserData = async () => {
        const { data:authdata } = await supabase.auth.getUser()
        if(authdata?.user){
            setuserName(authdata.user.user_metadata.full_name)
            setimage(authdata.user.user_metadata.avatar_url)
        }
      }
    
     
      useEffect(() => {
        fetchUserData()
      }, [])
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
       useEffect(()=>{
        fetchUserCredits()
      },[])

  const history = () => navigate("/history");
  const pricing = () => navigate("/pricing");
  const handlelogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div>
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
    </div>
  )
}

export default DashNav