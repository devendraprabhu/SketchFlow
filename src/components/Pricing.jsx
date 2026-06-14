import React from 'react'
import { useNavigate } from 'react-router-dom'
import DashNav from './DashNav'
import { Check, Zap } from 'lucide-react'
import { supabase } from '../supabase'

const Pricing = () => {
  const navigate = useNavigate();
  
  const dashboard = () => {
    navigate("/dashboard")
  }
  
  const history = () => {
    navigate("/history")
  }

  const handleCheckout = async (amount, creditsToAdd) => {
    const { data: authData } = await supabase.auth.getUser()
    if (!authData.user) {
      alert("Please Log in to Upgrade")
      return;
    }

    try {
      const orderResponse = await fetch("https://flowstatebackend-production.up.railway.app/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amount, user_id: authData.user.id })
      });
      
      const orderData = await orderResponse.json()
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount, 
        currency: "INR",
        name: "FlowState",
        description: `Upgrade to ${creditsToAdd} Credits`,
        order_id: orderData.order_id,
        handler: async function (response) {
          try {
            const verifyResponse = await fetch("https://flowstatebackend-production.up.railway.app/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                user_id: authData.user.id,
                credits_to_add: creditsToAdd
              })
            });

            if (verifyResponse.ok) {
              alert("Payment Verified! Your credits have been added.");
              navigate("/dashboard");
            } else {
              alert("Payment verification failed. Did you use a real card?");
            }
          } catch (error) {
            console.error("Verification error:", error);
          }
        },
        prefill: { email: authData.user.email },
        theme: { color: "#000000" }
      } 
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Could not initialize checkout. Is your Python server running?");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-['Geist',_'Inter',_sans-serif]"> 
      <DashNav/>
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Simple, transparent pricing</h1>
        </div>

        {/* Flex container to place cards side-by-side on md+ screens */}
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 justify-center items-stretch">
          
          {/* Card 1 */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
            <div className="p-8 sm:p-10 text-center bg-black text-white">
              <p className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">Creator Pack</p>
              <div className="flex items-center justify-center">
                <span className="text-5xl font-extrabold tracking-tight">₹199</span>
              </div>
            </div>
            <div className="p-8 sm:p-10 bg-white flex-1 flex flex-col">
              <ul className="space-y-5 mb-8 flex-1">
                <li className="flex items-center">
                  <Check className="flex-shrink-0 w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700 font-medium">20 AI Generation Credits</span>
                </li>
              </ul>
              <button className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md mt-auto" onClick={() => handleCheckout(10, 20)}>
                <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                Refill Now
              </button>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative">
            <div className="p-8 sm:p-10 text-center bg-blue-600 text-white">
              <p className="text-sm font-bold uppercase tracking-wider text-blue-200 mb-2">Pro Pack</p>
              <div className="flex items-center justify-center">
                <span className="text-5xl font-extrabold tracking-tight">₹399</span>
              </div>
            </div>
            <div className="p-8 sm:p-10 bg-white flex-1 flex flex-col">
              <ul className="space-y-5 mb-8 flex-1">
                <li className="flex items-center">
                  <Check className="flex-shrink-0 w-6 h-6 text-green-500 mr-3" />
                  <span className="text-gray-700 font-medium">100 AI Generation Credits</span>
                </li>
              </ul>
              <button onClick={() => handleCheckout(20, 100)} className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md mt-auto">
                <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                Refill Now
              </button>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  )
}

export default Pricing