import React from 'react';
import Nav from './Nav';

const About = () => {
  return (
    <div className="min-h-screen bg-[#fafafa] font-['Geist',_'Inter',_sans-serif]">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-6">About FlowState</h1>
        
        <div className="text-gray-700 space-y-6 text-lg leading-relaxed">
          <p>
            Hey there, and welcome to FlowState. 
          </p>
          
          <p>
            I want to be completely transparent: this is my very first full-stack project, built entirely from scratch during my final year of college. FlowState isn't a massive corporate product with a team of fifty engineers; it is a solo venture fueled by late nights, endless debugging, a steep learning curve, and a whole lot of pizza.
          </p>

          <p>
            I built the entire architecture myself—from and from with help of ai the React frontend and Python backend to wiring up the databases, integrating the AI, and securing the payment gateways. It was built out of a genuine desire to learn how real-world applications actually work, and to create a tool that actually saves people time.
          </p>

          <p>
            <strong>This is FlowState v1.</strong> 
          </p>

          <p>
            Because this is version 1, and because I am still learning, it might not be absolutely perfect yet. That is exactly why I would love to hear from you. I am actively looking for honest reviews, constructive criticism, and feature requests. 
          </p>

          <p>
            If something breaks, tell me so I can fix it. If the AI output could be formatted better, let me know. If it saves you hours of work, I would be thrilled to hear that, too.
          </p>

          <p>
            Thank you for taking a chance on a solo developer's first launch. I'm excited to keep building and improving this tool for you.
          </p>

          <div className="pt-8">
            <a 
              href="mailto:raikaidev21@gmail.com" 
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Mail me
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;