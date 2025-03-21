'use client';

import { useEffect } from 'react';
import { useResumeStore } from '@/stores/resume-store';
import { ResumeBuilder } from './ResumeBuilder';

export default function NewResumePage() {
  const initializeEmptyResume = useResumeStore(state => state.initializeEmptyResume);

  useEffect(() => {
    initializeEmptyResume();
  }, [initializeEmptyResume]);

  return <ResumeBuilder />;
}