
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import GradeInput from './components/GradeInput';
import StudyDashboard from './components/StudyDashboard';
import LearningSpace from './components/LearningSpace';
import WrongAnswerManager from './components/WrongAnswerManager';
import Auth from './components/Auth';
import { AppSection, TextbookInfo, Unit, Language, User, WrongAnswer } from './types';
import { generateUnits } from './services/geminiService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [lang, setLang] = useState<Language>('ko');
  const [section, setSection] = useState<AppSection>(AppSection.SETUP);
  const [textbook, setTextbook] = useState<TextbookInfo | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(false);

  // 데이터 로컬 스토리지에서 복구
  useEffect(() => {
    const savedUser = localStorage.getItem('ai_study_user');
    const savedTextbook = localStorage.getItem('ai_study_textbook');
    const savedLang = localStorage.getItem('ai_study_lang');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTextbook) {
      const tb = JSON.parse(savedTextbook);
      setTextbook(tb);
      setSection(AppSection.DASHBOARD);
      // 단원 목록도 캐싱하면 좋지만 여기선 간단히 재호출
      fetchUnits(tb, (savedLang as Language) || 'ko');
    }
    if (savedLang) setLang(savedLang as Language);
  }, []);

  const fetchUnits = async (info: TextbookInfo, currentLang: Language) => {
    setLoading(true);
    try {
      const unitList = await generateUnits(info.grade, info.publisher, info.subject, currentLang);
      setUnits(unitList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('ai_study_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('ai_study_user');
    localStorage.removeItem('ai_study_textbook');
    setSection(AppSection.SETUP);
    setTextbook(null);
  };

  const handleSetup = async (info: TextbookInfo) => {
    setTextbook(info);
    localStorage.setItem('ai_study_textbook', JSON.stringify(info));
    setSection(AppSection.DASHBOARD);
    await fetchUnits(info, lang);
  };

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('ai_study_lang', newLang);
    // 언어 변경 시 교과서 정보가 있다면 다시 로드
    if (textbook) fetchUnits(textbook, newLang);
  };

  const renderContent = () => {
    if (!user) return <Auth onLogin={handleLogin} lang={lang} />;
    if (!textbook || section === AppSection.SETUP) return <GradeInput onSubmit={handleSetup} lang={lang} />;

    switch (section) {
      case AppSection.DASHBOARD:
        return <StudyDashboard units={units} onSelectUnit={(u) => { setSelectedUnit(u); setSection(AppSection.LEARNING); }} loading={loading} />;
      case AppSection.LEARNING:
        return selectedUnit ? <LearningSpace unit={selectedUnit} textbook={textbook} lang={lang} /> : null;
      case AppSection.WRONG_ANSWERS:
        return <WrongAnswerManager lang={lang} />;
      default:
        return <div className="text-center py-20 font-bold text-slate-400">학습 데이터 준비 중...</div>;
    }
  };

  return (
    <Layout 
      activeSection={section} 
      onNavigate={setSection}
      hasTextbook={!!textbook && !!user && section !== AppSection.SETUP}
      lang={lang}
      onLangChange={handleLangChange}
      user={user}
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
