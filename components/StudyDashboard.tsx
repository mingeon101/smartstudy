
import React from 'react';
import { Unit } from '../types';

interface StudyDashboardProps {
  units: Unit[];
  onSelectUnit: (unit: Unit) => void;
  loading: boolean;
}

const StudyDashboard: React.FC<StudyDashboardProps> = ({ units, onSelectUnit, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
        <p className="text-slate-400 font-bold animate-pulse text-sm">Analyzing Textbook...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {units.map((unit) => (
        <div 
          key={unit.id}
          className="group bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer active:scale-98"
          onClick={() => onSelectUnit(unit)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-inner">
              <span className="text-xl font-black">{unit.id}</span>
            </div>
            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Available</div>
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-2 leading-snug">{unit.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">{unit.description}</p>
          <div className="flex items-center text-indigo-600 text-[10px] font-black uppercase tracking-widest border-t border-slate-50 pt-4">
            Start Learning
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7"></path></svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyDashboard;
