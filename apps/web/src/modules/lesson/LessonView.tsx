import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
//@ts-ignore
import debounce from 'lodash.debounce';
import { useAuth } from '../state/useAuth';

interface Lesson {
  id: string; title: string; content: string; exampleCode?: string; exerciseStarter?: string; solutionCode?: string; language?: string;
}

export const LessonView: React.FC = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [code, setCode] = useState('');
  const [html, setHtml] = useState('');
  const { token } = useAuth();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const persist = useCallback(async (lessonId: string, status: string, lastCode?: string) => {
    if(!token) return;
    try {
      await axios.post(`${API}/progress`, { lessonId, status, lastCode }, { headers: { Authorization: `Bearer ${token}` } });
    } catch {}
  }, [token, API]);

  const debouncedSave = useCallback(debounce((lessonId: string, val: string) => {
    persist(lessonId, 'IN_PROGRESS', val);
  }, 800), [persist]);

  useEffect(() => {
    if (!id) return;
    axios.get(`${API}/courses/lesson/${id}`).then(r => {
      setLesson(r.data);
      setCode(r.data.exerciseStarter || r.data.exampleCode || '');
      const rendered = marked.parse(r.data.content || '');
      //@ts-ignore
      setHtml(DOMPurify.sanitize(rendered));
    });
  }, [id, API]);

  if (!lesson) return <div>Chargement...</div>;

  return (
    <div className="lesson-view">
      <h1>{lesson.title}</h1>
      <article className="lesson-content" dangerouslySetInnerHTML={{ __html: html }} />
      {lesson.exampleCode && (
        <section>
          <h2>Exemple</h2>
          <Editor
            height="200px"
            defaultLanguage={lesson.language || 'typescript'}
            value={lesson.exampleCode}
            options={{ readOnly: true, wordWrap: 'on', minimap: { enabled: false } }}
          />
        </section>
      )}
      <section>
        <h2>Exercice</h2>
        <Editor
          height="300px"
          defaultLanguage={lesson.language || 'typescript'}
          value={code}
          onChange={(v) => { const val = v || ''; setCode(val); debouncedSave(lesson.id, val); }}
          options={{ wordWrap: 'on', minimap: { enabled: false } }}
        />
        {token && (
          <div style={{marginTop:'0.75rem', display:'flex', gap:'.5rem'}}>
            <button onClick={()=> persist(lesson.id, 'COMPLETED', code)}>Marquer comme terminé</button>
          </div>
        )}
      </section>
    </div>
  );
};
