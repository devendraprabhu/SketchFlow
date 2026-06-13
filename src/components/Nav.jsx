import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase"

//geeeee
const Nav = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const handlesession = async () => {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    handlesession();
  }, []);

  const homepage= ()=>{
    navigate("/")
  }
  const about = ()=>{
    navigate("/about")
  }


  return (
    <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between sticky top-0 z-50 bg-white/70 backdrop-blur-md">
      <h1 className="text-6xl tracking-tight font-['Bebas_Neue']">FLowState</h1>
      
 
      <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
        <li className="hover:text-black cursor-pointer font-medium" onClick={homepage} >Home</li>
        <li className="hover:text-black cursor-pointer" onClick={about}>About me</li>
      </ul>
      
      <div className="flex items-center gap-4">
        
        <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition cursor-pointer" onClick={handleLogin}>
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Nav;