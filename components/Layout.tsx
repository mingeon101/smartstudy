
import React from 'react';
import { AppSection, Language, User } from '../types';
import { locales } from '../locales';

interface LayoutProps {
  children: React.ReactNode;
  activeSection: AppSection;
  onNavigate: (section: AppSection) => void;
  hasTextbook: boolean;
  lang: Language;
  onLangChange: (lang: Language) => void;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeSection, onNavigate, hasTextbook, lang, onLangChange, user, onLogout 
}) => {
  const t = locales[lang];

  const navItems = [
    { id: AppSection.DASHBOARD, label: t.units, icon: '📚' },
    { id: AppSection.LEARNING, label: t.studyRoom, icon: '🎓' },
    { id: AppSection.WRONG_ANSWERS, label: t.mistakeNote, icon: '✍️' },
    { id: AppSection.NOTES, label: t.myNotes, icon: '📝' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden flex-col md:flex-row">
      {/* Desktop Sidebar */}
      {hasTextbook && (
        <aside className="hidden md:flex w-72 bg-indigo-900 text-white flex-col shadow-xl">
          <div className="p-8">
            <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
            <p className="text-indigo-300 text-xs mt-1 uppercase tracking-widest">{t.subtitle}</p>
          </div>
          
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 ${
                  activeSection === item.id 
                    ? 'bg-white/10 text-white shadow-inner' 
                    : 'text-indigo-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>
          
          <div className="p-6 border-t border-indigo-800 space-y-4">
            <div className="flex items-center gap-2 bg-indigo-800/50 p-1 rounded-lg">
              <button 
                onClick={() => onLangChange('ko')}
                className={`flex-1 py-1 px-2 rounded-md text-xs font-bold transition-all ${lang === 'ko' ? 'bg-indigo-600 text-white shadow' : 'text-indigo-300'}`}
              >
                KO
              </button>
              <button 
                onClick={() => onLangChange('en')}
                className={`flex-1 py-1 px-2 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-indigo-300'}`}
              >
                EN
              </button>
            </div>
            <button 
              onClick={() => onNavigate(AppSection.SETUP)}
              className="w-full text-xs text-indigo-400 hover:text-white transition-colors"
            >
              {t.changeTextbook}
            </button>
          </div>
        </aside>
      )}
      
      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-100 px-6 py-4 flex justify-between items-center safe-top">
         <h1 className="text-lg font-bold text-indigo-600">{t.title}</h1>
         <div className="flex items-center gap-2">
           <button 
             onClick={() => onLangChange(lang === 'ko' ? 'en' : 'ko')}
             className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded"
           >
             {lang.toUpperCase()}
           </button>
           <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
             {user?.name?.[0].toUpperCase()}
           </div>
         </div>
      </header>

      <main className="flex-1 overflow-y-auto relative pb-24 md:pb-0">
        <header className="hidden md:flex sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 justify-between items-center">
           <h2 className="text-lg font-bold text-slate-800">
            {navItems.find(i => i.id === activeSection)?.label}
           </h2>
           <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
               <span className="text-sm font-bold text-slate-800">{user?.name}</span>
               <button onClick={onLogout} className="text-[10px] text-red-500 font-bold hover:underline">{t.logout}</button>
             </div>
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-md">
               {user?.name?.[0].toUpperCase()}
             </div>
           </div>
        </header>
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {hasTextbook && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-40 safe-bottom">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${
                activeSection === item.id ? 'text-indigo-600 scale-110' : 'text-slate-400'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
};

export default Layout;
