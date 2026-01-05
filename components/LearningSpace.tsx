
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
  const [showNote, setShowNote] = useState(true);
  const t = locales[lang];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (mode === LearningMode.PPT) {
          const res = await generateSlides(unit.title, textbook.grade, lang);
          setSlides(res);
        } else if (mode === LearningMode.PODCAST) {
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
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit mb-6">
          {[
            { id: LearningMode.PPT, label: 'AI PPT', icon: '📽️' },
            { id: LearningMode.PODCAST, label: 'AI Podcast', icon: '🎙️' },
          ].map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                mode === m.id ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-600'
              }`}
            >
              <span>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
               <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
               <h3 className="text-2xl font-bold text-slate-800">{t.generating}</h3>
            </div>
          ) : (
            <>
              {mode === LearningMode.PPT && slides.length > 0 && (
                <div className="flex-1 flex flex-col p-12">
                  <div className="flex-1">
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold uppercase mb-6 inline-block">Slide {currentSlide + 1} / {slides.length}</span>
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-10 leading-tight">{slides[currentSlide].title}</h2>
                    <ul className="space-y-6">
                      {slides[currentSlide].content.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-5 text-xl text-slate-700 leading-relaxed">
                          <span className="mt-2.5 w-3 h-3 rounded-full bg-indigo-500 shrink-0 shadow-sm shadow-indigo-200"></span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between mt-8">
                    <button disabled={currentSlide === 0} onClick={() => setCurrentSlide(prev => prev - 1)} className="px-8 py-3 bg-slate-100 rounded-xl font-bold disabled:opacity-30">{t.prev}</button>
                    <button disabled={currentSlide === slides.length - 1} onClick={() => setCurrentSlide(prev => prev + 1)} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold disabled:opacity-30">{t.next}</button>
                  </div>
                </div>
              )}
              {mode === LearningMode.PODCAST && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-40 h-40 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-10 animate-pulse">
                    <span className="text-6xl">🎙️</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{unit.title}</h2>
                  {audioUrl && <audio controls src={audioUrl} className="w-full max-w-md" autoPlay />}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className={`w-full lg:w-96 flex flex-col shrink-0 ${showNote ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between mb-3 px-1">
          <h4 className="font-bold text-slate-700 flex items-center gap-2"><span>✍️</span> {t.quickNote}</h4>
          <button onClick={() => setShowNote(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">{t.hide}</button>
        </div>
        <div className="flex-1 min-h-[500px]">
          <NoteCanvas />
        </div>
        <div className="mt-4 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-inner">
           <p className="text-xs text-indigo-700 font-bold leading-relaxed">💡 {t.proTip}</p>
        </div>
      </div>
    </div>
  );
};

export default LearningSpace;
