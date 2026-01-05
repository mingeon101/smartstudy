
import React, { useState, useEffect } from 'react';
import { WrongAnswer, Language } from '../types';
import { analyzeWrongAnswer } from '../services/geminiService';
import { locales } from '../locales';

interface Props {
  lang: Language;
}

const WrongAnswerManager: React.FC<Props> = ({ lang }) => {
  const [items, setItems] = useState<WrongAnswer[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WrongAnswer | null>(null);
  const t = locales[lang];

  useEffect(() => {
    const saved = localStorage.getItem('ai_study_mistakes');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      try {
        const result = await analyzeWrongAnswer(base64, lang);
        const newItem: WrongAnswer = {
          id: Date.now().toString(),
          imageUrl: base64,
          analysis: result.analysis,
          correction: result.correction,
          timestamp: Date.now()
        };
        const updated = [newItem, ...items];
        setItems(updated);
        localStorage.setItem('ai_study_mistakes', JSON.stringify(updated));
        setSelectedItem(newItem);
      } catch (err) {
        alert('Analysis failed.');
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-10">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-12 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-white/10 text-9xl font-black select-none pointer-events-none">ERROR</div>
        <div className="max-w-xl relative z-10">
          <h2 className="text-4xl font-extrabold mb-6 tracking-tight">{t.mistakeNote}</h2>
          <p className="text-indigo-100 text-lg mb-10 leading-relaxed opacity-90">틀린 문제를 사진으로 찍어 올리세요. AI가 왜 틀렸는지 분석하고 정답에 도달하는 길을 안내합니다.</p>
          <label className="inline-flex items-center gap-4 px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black cursor-pointer hover:bg-slate-50 transition-all shadow-xl active:scale-95">
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={analyzing} />
            {analyzing ? (
              <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div> {t.analyzingMistake}</>
            ) : (
              <><span className="text-2xl">📸</span> {t.uploadPhoto}</>
            )}
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div 
            key={item.id}
            className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2"
            onClick={() => setSelectedItem(item)}
          >
            <div className="h-56 overflow-hidden bg-slate-100 relative">
              <img src={item.imageUrl} alt="Mistake" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <div className="p-6">
              <div className="text-[10px] text-indigo-500 font-black uppercase mb-3 tracking-widest bg-indigo-50 w-fit px-2 py-0.5 rounded">
                {new Date(item.timestamp).toLocaleDateString()}
              </div>
              <h4 className="font-bold text-slate-800 line-clamp-2 leading-relaxed">{item.analysis}</h4>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center px-10 py-8 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-900">{t.aiAnalysis}</h3>
              <button onClick={() => setSelectedItem(null)} className="p-3 hover:bg-slate-100 rounded-full transition-all">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="sticky top-0">
                <img src={selectedItem.imageUrl} alt="Mistake" className="w-full rounded-3xl shadow-lg border border-slate-200" />
              </div>
              <div className="space-y-10">
                <section>
                  <h5 className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span> {t.aiAnalysis}
                  </h5>
                  <div className="text-slate-700 leading-relaxed bg-indigo-50/50 p-6 rounded-3xl text-lg font-medium border border-indigo-100">{selectedItem.analysis}</div>
                </section>
                <section>
                  <h5 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span> {t.howToFix}
                  </h5>
                  <div className="text-slate-700 leading-relaxed bg-emerald-50/50 p-6 rounded-3xl text-lg font-medium border border-emerald-100">{selectedItem.correction}</div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WrongAnswerManager;
