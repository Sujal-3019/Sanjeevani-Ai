import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight } from 'lucide-react';
import logo from '../assets/logo4.png'; 

export default function Sidebar({ navigationItems = [] }) {
  const navigate = useNavigate();

  return (
    <aside className="w-[250px] bg-[#0A1128] flex flex-col justify-between h-screen sticky top-0 shrink-0 border-r border-[#17203A]">
      
      <div>
        {/* Centered Logo Section */}
        <div className="p-6 flex flex-col items-center mt-4 mb-6">
          <div className="mb-4 w-[80px] h-[80px] flex items-center justify-center rounded-[1.25rem] overflow-hidden shadow-lg bg-[#111A35] shrink-0">
            <img src={logo} alt="Sanjeevani AI" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-[18px] font-bold text-white tracking-wide text-center mt-1">
            Sanjeevani <span className="text-[#7886F6]">AI</span>
          </h2>
        </div>
        
        {/* Professional Left-Aligned Navigation Section (No "NAVIGATION" Header) */}
        <div className="px-4">
          <nav className="space-y-1.5">
            {navigationItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className={`relative w-full flex items-center px-4 py-3.5 rounded-xl text-[14px] font-medium transition-all duration-200 group ${
                    item.isActive 
                      ? 'bg-[#181C36] text-[#7886F6]' 
                      : 'text-[#8B9CB6] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {/* Left Highlight Pill for Active State */}
                  {item.isActive && (
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-1 bg-[#7886F6] rounded-r-md"></div>
                  )}
                  
                  <div className="flex items-center space-x-3.5">
                    <Icon size={18} className={item.isActive ? 'text-[#7886F6]' : 'text-[#617492] group-hover:text-white transition-colors'} strokeWidth={item.isActive ? 2.5 : 2} />
                    <span>{item.name}</span>
                  </div>

                  {/* Right Chevron for Active State */}
                  {item.isActive && (
                    <ChevronRight size={16} className="ml-auto text-[#7886F6] opacity-60" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Logout Section */}
      <div className="p-4 border-t border-[#17203A]">
        <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-xl text-[14px] font-medium transition-colors text-[#8B9CB6] hover:bg-white/5 hover:text-white group"
        >
          <LogOut size={18} className="text-[#617492] group-hover:text-white transition-colors" />
          <span>Log out</span>
        </button>
      </div>

    </aside>
  );
}