import React from "react";
import { supabase } from "../supabase"
//geeeee

const Nav = () => {
    const handleLogin = async()=>{
        await supabase.auth.signInWithOAuth({
            provider:"google",
            options:{
                redirectTo:`${window.location.origin}/dashboard`
            }
        })
}

 const handlesession = async()=>{
  const {session} = await supabase.auth.getSession()
    if(session.session){
      navigate("/dashboard")
    }
 }

 useEffect(()=>{
  handlesession()
 },[])

    console.log(supabase.auth.getSession())
    console.log(supabase.auth.getUser())
  return (
    
    <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between sticky top-0 z-50 bg-white/70 backdrop-blur-md">
   
      <h1 className="text-6xl  tracking-tight">
        SketchFlow
      </h1>
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <li className="hover:text-black cursor-pointer text-medium">Home</li>
        <li className="hover:text-black cursor-pointer">Pricing</li>
        <li className="hover:text-black cursor-pointer">About me</li>
      </ul>
      <div className="flex items-center gap-4">
        <button onClick={handleLogin} className="text-sm font-medium text-gray-600 hover:text-black cursor-pointer">
          Login
        </button>
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Nav;