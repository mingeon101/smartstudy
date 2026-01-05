
import React, { useState, useEffect } from 'react';
import { Unit, LearningMode, Slide, TextbookInfo, Language } from '../types';
import { generateSlides, generatePodcastAudio } from '../services/geminiService';
import { locales } from '../locales';
import NoteCanvas from './NoteCanvas';

interface LearningSpaceProps {
  unit: Unit;
  textbook: TextbookInfo;
  lang: Language;
}

const LearningSpace: React.FC<LearningSpaceProps> = ({ unit, textbook, lang }) => {
  const [mode, setMode] = useState<LearningMode>(LearningMode.PPT);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const t = locales[lang];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (mode === LearningMode.PPT && slides.length === 0) {
          const res = await generateSlides(unit.title, textbook.grade, lang);
          setSlides(res);
        } else if (mode === LearningMode.PODCAST && !audioUrl) {
          const content = slides.length > 0 ? slides.map(s => s.title).join(', ') : unit.description;
          const base64 = await generatePodcastAudio(content, lang);
          if (base64) {
            const blob = await fetch(`data:audio/pcm;base64,${base64}`).then(res => res.blob());
            setAudioUrl(URL.createObjectURL(blob));
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [mode, unit, lang]);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Unit Info Mobile */}
        <div className="mb-4">
          <h3 className="text-xl font-black text-slate-800">{unit.title}</h3>
          <p className="text-xs text-slate-500 font-medium">{textbook.publisher} • {textbook.subject}</p>
        </div>

        <div className="flex bg-slate-200/50 p-1 rounded-2xl w-full mb-6">
          {[
            { id: LearningMode.PPT, label: 'PPT', icon: '📽️' },
            { id: LearningMode.PODCAST, label: 'Audio', icon: '🎙️' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
                mode === m.id ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600'
              }`}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        <div className="aspect-[4/5] md:aspect-auto md:h-[500px] bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
               <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
               <h3 className="text-lg font-bold text-slate-800">{t.generating}</h3>
            </div>
          ) : (
            <>
              {mode === LearningMode.PPT && slides.length > 0 && (
                <div className="flex-1 flex flex-col p-6 md:p-12">
                  <div className="flex-1 overflow-y-auto">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 inline-block">Page {currentSlide + 1} / {slides.length}</span>
                    <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">{slides[currentSlide].title}</h2>
                    <ul className="space-y-4">
                      {slides[currentSlide].content.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-base md:text-xl text-slate-700 leading-relaxed">
                          <span className="mt-2 w-2 h-2 rounded-full bg-indigo-500 shrink-0 shadow-sm"></span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between gap-4 mt-6">
                    <button disabled={currentSlide === 0} onClick={() => setCurrentSlide(prev => prev - 1)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black disabled:opacity-30 active:scale-95 transition-transform">{t.prev}</button>
                    <button disabled={currentSlide === slides.length - 1} onClick={() => setCurrentSlide(prev => prev + 1)} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black disabled:opacity-30 active:scale-95 transition-transform">{t.next}</button>
                  </div>
                </div>
              )}
              {mode === LearningMode.PODCAST && (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-32 h-32 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-8 animate-pulse shadow-inner">
                    <span className="text-5xl">🎙️</span>
                  </div>
                  <h2 className="text-xl font-black mb-2">{unit.title}</h2>
                  <p className="text-sm text-slate-500 mb-8">{t.proTip}</p>
                  {audioUrl && <audio controls src={audioUrl} className="w-full" autoPlay />}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Note Sidebar / Bottom Sheet for Mobile */}
      <div className={`fixed inset-0 z-50 md:relative md:inset-auto md:w-96 md:flex flex-col shrink-0 transition-all ${showNote ? 'flex' : 'hidden'}`}>
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm md:hidden" onClick={() => setShowNote(false)}></div>
        <div className="mt-auto md:mt-0 bg-white rounded-t-[2.5rem] md:rounded-3xl p-6 relative z-10 flex flex-col h-[80vh] md:h-[600px] shadow-2xl">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-black text-slate-800 flex items-center gap-2"><span>✍️</span> {t.quickNote}</h4>
            <button onClick={() => setShowNote(false)} className="text-xs font-black text-indigo-600">{t.hide}</button>
          </div>
          <div className="flex-1 border border-slate-100 rounded-2xl overflow-hidden">
            <NoteCanvas />
          </div>
          <div className="mt-4 p-4 bg-indigo-50 rounded-2xl">
             <p className="text-[10px] text-indigo-700 font-black leading-relaxed">💡 {t.proTip}</p>
          </div>
        </div>
      </div>

      {/* Floating Action Button for Mobile Note */}
      <button 
        onClick={() => setShowNote(true)}
        className={`md:hidden fixed bottom-28 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30 transform transition-transform ${showNote ? 'scale-0' : 'scale-100'}`}
      >
        <span className="text-2xl">✍️</span>
      </button>
    </div>
  );
};

export default LearningSpace;
