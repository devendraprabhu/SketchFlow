import React from 'react'
import { supabase } from "../supabase"
import { useNavigate } from 'react-router-dom'



const Dashboard = () => {
    const navigate = useNavigate();
    const handlelogout = async () =>{
        await supabase.auth.signOut()
        console.log("logged out");
        navigate("/")
        
        
    }
  return (
    <div>
   <nav>

    <button className='bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition' 
    onClick={handlelogout}>Logout</button> 

    </nav>
    <h1 className="text-center" >Welcome back Devendra</h1>
    </div>
  ) 
}

export default Dashboard