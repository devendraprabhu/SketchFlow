import React from 'react';
import Nav from './Nav';

const Legal = ({ title, lastUpdated, content }) => {
  return (
    <div className="min-h-screen bg-[#fafafa] font-['Geist',_'Inter',_sans-serif]">
      <Nav />
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">{title}</h1>
        <p className="text-sm font-medium text-gray-500 mb-12">Last updated: {lastUpdated}</p>
        
        <div className="text-gray-700 space-y-6 leading-relaxed whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Legal;