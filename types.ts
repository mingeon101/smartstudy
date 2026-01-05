
export type Language = 'ko' | 'en';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TextbookInfo {
  grade: string;
  publisher: string;
  subject: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
}

export interface Slide {
  title: string;
  content: string[];
  imagePrompt?: string;
}

export interface WrongAnswer {
  id: string;
  imageUrl: string;
  analysis: string;
  correction: string;
  timestamp: number;
}

export interface Note {
  id: string;
  unitId: string;
  content: string;
  timestamp: number;
}

export enum AppSection {
  SETUP = 'setup',
  DASHBOARD = 'dashboard',
  LEARNING = 'learning',
  WRONG_ANSWERS = 'wrong_answers',
  NOTES = 'notes'
}

export enum LearningMode {
  PPT = 'ppt',
  PODCAST = 'podcast',
  VIDEO = 'video'
}
