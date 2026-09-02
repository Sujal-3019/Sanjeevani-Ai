import React from 'react';

export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-[1.25rem] p-6 shadow-[0_2px_10px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col justify-center">
      <span className="text-[13px] font-bold text-slate-500 tracking-wide">
        {label}
      </span>
      <p className="text-[26px] font-semibold text-[#0f172a] mt-1.5 tracking-tight">
        {value}
      </p>
    </div>
  );
}