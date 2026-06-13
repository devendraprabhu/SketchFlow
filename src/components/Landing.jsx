import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Wand2, Zap, Play } from 'lucide-react';
import { supabase } from "../supabase"
import Nav from './Nav';


const Landing = () => {
   const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const words = ["Shorts.", "Reels.", "TikToks."];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white selection:bg-black selection:text-white font-['Geist',_'Inter',_sans-serif]">
      <Nav />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Headline */}
          <h1 className="text-7xl md:text-8xl lg:text-[5rem] font-black tracking-tighter text-black leading-[1.05] max-w-5xl">
            Extract scripts from any{" "}
            <span 
              key={index} 
              className="block text-black transition-all duration-500 ease-out"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                animation: 'fadeInUp 0.5s ease-out'
              }}
            >
              {words[index]}
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 font-medium max-w-2xl leading-relaxed tracking-tight">
            One video in. Endless ideas out. Turn any video into high-converting social media posts and scripts in seconds.
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <button className="group relative inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-gray-900 active:scale-95 shadow-sm hover:shadow-lg border border-black" onClick={handleLogin}>
              Start Creating Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Trust indicator */}
    
        </div>
      </main>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="group border border-gray-200 rounded-xl p-8 hover:border-black transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
              <Wand2 size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-black mb-3 text-left">AI Transcription</h3>
            <p className="text-gray-600 font-medium leading-relaxed text-left">Automatically transcribe and convert your videos into high-converting social media posts.</p>
          </div>

          {/* Feature 2 */}
          <div className="group border border-gray-200 rounded-xl p-8 hover:border-black transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
              <Zap size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-black mb-3 text-left">Lightning Fast</h3>
            <p className="text-gray-600 font-medium leading-relaxed text-left">Powered by Llama 3 and Whisper models for accurate transcription.</p>
          </div>

          {/* Feature 3 */}
          <div className="group border border-gray-200 rounded-xl p-8 hover:border-black transition-all duration-300 hover:shadow-lg">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
              <Sparkles size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-black mb-3 text-left">Smart Ideas</h3>
            <p className="text-gray-600 font-medium leading-relaxed text-left">Get AI-powered script suggestions and content hooks tailored for your audience.</p>
          </div>

        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-gray-100">
        <h2 className="text-4xl md:text-5xl font-black text-black mb-16 text-center">How it works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center mb-6 font-black text-lg text-black">
              1
            </div>
            <h3 className="text-lg font-bold text-black mb-3">Upload Video</h3>
            <p className="text-gray-600 font-medium">Drop any Shorts, Reel, or TikTok and let us handle the rest.</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-0.5 h-px bg-gray-300" />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center mb-6 font-black text-lg text-black">
              2
            </div>
            <h3 className="text-lg font-bold text-black mb-3">AI Extracts</h3>
            <p className="text-gray-600 font-medium">Our model transcribes and extracts the best hooks and ideas.</p>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-0.5 h-px bg-gray-300" />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full border-2 border-black flex items-center justify-center mb-6 font-black text-lg text-black">
              3
            </div>
            <h3 className="text-lg font-bold text-black mb-3">Copy & Post</h3>
            <p className="text-gray-600 font-medium">Get ready-to-use scripts and posts. Launch in seconds.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-24 border-t border-gray-100">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-black" >Ready to create?</h2>
          
          <button className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-200 hover:bg-gray-900 active:scale-95 shadow-sm hover:shadow-lg border border-black" onClick={handleLogin}>
            Start Creating Free
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-sm text-gray-600 font-medium">
            <a href="/terms" className="hover:text-black transition-colors duration-200">Terms of Service</a>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <a href="/privacy" className="hover:text-black transition-colors duration-200">Privacy Policy</a>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <a href="/refunds" className="hover:text-black transition-colors duration-200">Refund Policy</a>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <a href="/about" className="hover:text-black transition-colors duration-200">About</a>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <a href="https://forms.gle/M4NBKmx2HoV4mVv37" className="hover:text-black transition-colors duration-200">Report a issue</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Landing;