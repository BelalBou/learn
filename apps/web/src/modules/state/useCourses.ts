import { useEffect } from 'react';
import create from 'zustand';
import axios from 'axios';
import { Course } from '@learn/types';

interface CoursesState {
  courses: Course[];
  fetch: () => Promise<void>;
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  fetch: async () => {
    const res = await axios.get<Course[]>(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/courses`);
    set({ courses: res.data });
  },
}));

export const useCourses = () => {
  const courses = useCoursesStore(s => s.courses);
  const fetch = useCoursesStore(s => s.fetch);
  useEffect(() => { if (!courses.length) fetch(); }, [courses, fetch]);
  return { courses };
};
