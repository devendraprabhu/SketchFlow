import React, { useState } from 'react';
import { Copy, Check, X } from 'lucide-react';

const ProjectView = ({ project, onClose }) => {
  const [copiedField, setCopiedField] = useState(null);

  let aiData = null;
  try {
    if (project.generated_code) {
      aiData = typeof project.generated_code === 'string' 
        ? JSON.parse(project.generated_code) 
        : project.generated_code;
    }
  } catch (error) {
    console.error("Error parsing AI data:", error);
  }

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-black">
          <X size={24} />
        </button>

        <h2 className="text-3xl font-bold mb-6 font-['Bebas_Neue']">{project.project_name}</h2>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <video src={project.image_url} controls className="w-full rounded-xl bg-black aspect-9/16 object-cover" />
          </div>

          <div className="w-full lg:w-2/3 space-y-4">
            {aiData && aiData.content ? (
              <>
                {[
                  { label: "YouTube Title", key: "title", text: aiData.content.youtube_title },
                  { label: "Description", key: "desc", text: aiData.content.youtube_description },
                  { label: "LinkedIn Post", key: "linked", text: aiData.content.linkedin_post },
                  { label: "X Post", key: "x", text: aiData.content.x_post },
                  { label: "Hashtags", key: "tags", text: aiData.content.hashtags }
                ].map((item) => (
                  <div key={item.key} className="bg-gray-50 p-4 rounded-xl border relative group">
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">{item.label}</h3>
                    <p className="text-sm text-gray-800 pr-8">{item.text}</p>
                    <button 
                      onClick={() => handleCopy(item.text, item.key)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-black"
                    >
                      {copiedField === item.key ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                ))}
              </>
            ) : (
              <p className="text-red-500">No content found or still processing.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;