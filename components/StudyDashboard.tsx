
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <p className="text-slate-500 font-medium animate-pulse">Analyzing Textbook Units...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {units.map((unit) => (
        <div 
          key={unit.id}
          className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer"
          onClick={() => onSelectUnit(unit)}
        >
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
            <span className="text-xl font-bold">{unit.id}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">{unit.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">{unit.description}</p>
          <div className="flex items-center text-indigo-600 text-xs font-bold uppercase tracking-wider">
            Explore Unit
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudyDashboard;
