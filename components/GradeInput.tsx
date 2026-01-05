
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
    <div className="max-w-md mx-auto mt-20 p-10 bg-white rounded-3xl shadow-2xl border border-slate-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full mb-6">
           <span className="text-4xl">📘</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{t.changeTextbook}</h1>
        <p className="text-slate-500 mt-2">{t.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t.grade}</label>
          <select 
            value={info.grade}
            onChange={(e) => setInfo({...info, grade: e.target.value})}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(g => <option key={g} value={g}>{g}{lang === 'ko' ? '학년' : 'th Grade'}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t.subject}</label>
          <select 
            value={info.subject}
            onChange={(e) => setInfo({...info, subject: e.target.value})}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {(lang === 'ko' ? ['과학', '수학', '역사', '영어', '사회'] : ['Science', 'Math', 'History', 'English', 'Social Studies']).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t.publisher}</label>
          <input 
            type="text"
            required
            placeholder={lang === 'ko' ? '예: 천재교육, 비상교육...' : 'e.g. Pearson, McGraw Hill...'}
            value={info.publisher}
            onChange={(e) => setInfo({...info, publisher: e.target.value})}
            className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-1"
        >
          {t.initDashboard}
        </button>
      </form>
    </div>
  );
};

export default GradeInput;
