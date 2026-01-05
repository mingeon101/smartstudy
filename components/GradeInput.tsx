
import React, { useState } from 'react';
import { TextbookInfo, Language } from '../types';
import { locales } from '../locales';

interface GradeInputProps {
  onSubmit: (info: TextbookInfo) => void;
  lang: Language;
}

const GradeInput: React.FC<GradeInputProps> = ({ onSubmit, lang }) => {
  const [info, setInfo] = useState<TextbookInfo>({
    grade: '5',
    publisher: '',
    subject: 'Science'
  });
  const t = locales[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (info.publisher) {
      onSubmit(info);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-10 overflow-hidden relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-50 rounded-full opacity-50 blur-3xl"></div>
        
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 text-white rounded-3xl shadow-xl shadow-indigo-200 mb-6 transform rotate-3">
             <span className="text-4xl">📘</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{t.changeTextbook}</h1>
          <p className="text-slate-500 mt-2 font-medium">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t.grade}</label>
            <select 
              value={info.grade}
              onChange={(e) => setInfo({...info, grade: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 appearance-none shadow-sm"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>{g}{lang === 'ko' ? '학년' : 'th Grade'}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t.subject}</label>
            <select 
              value={info.subject}
              onChange={(e) => setInfo({...info, subject: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 appearance-none shadow-sm"
            >
              {(lang === 'ko' ? ['과학', '수학', '역사', '영어', '사회'] : ['Science', 'Math', 'History', 'English', 'Social Studies']).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">{t.publisher}</label>
            <input 
              type="text"
              required
              placeholder={lang === 'ko' ? '예: 천재교육, 비상교육...' : 'e.g. Pearson, McGraw Hill...'}
              value={info.publisher}
              onChange={(e) => setInfo({...info, publisher: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-slate-700 shadow-sm"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 transition-all transform active:scale-95 mt-4"
          >
            {t.initDashboard}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GradeInput;
