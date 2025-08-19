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
  const { token, ensureFreshToken } = useAuth();
  const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const persist = useCallback(async (lessonId: string, status: string, lastCode?: string) => {
    if(!token) return;
    try {
      const fresh = await ensureFreshToken();
      await axios.post(`${API}/progress`, { lessonId, status, lastCode }, { headers: { Authorization: `Bearer ${fresh || token}` } });
    } catch {}
  }, [token, API, ensureFreshToken]);

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
        <details open style={{marginTop:'1.5rem'}}>
          <summary style={{cursor:'pointer', fontWeight:600, fontSize:'1.05rem'}}>💡 Démonstration</summary>
          <div style={{marginTop:'.75rem'}}>
            <Editor
              height="220px"
              defaultLanguage={lesson.language || 'javascript'}
              value={lesson.exampleCode}
              options={{ readOnly: true, wordWrap: 'on', minimap: { enabled: false } }}
            />
            <RunCode code={lesson.exampleCode} language={lesson.language || 'javascript'} />
          </div>
        </details>
      )}
      <details style={{marginTop:'1.5rem'}} open>
        <summary style={{cursor:'pointer', fontWeight:600, fontSize:'1.05rem'}}>🧪 Exercice</summary>
        <div style={{marginTop:'.75rem'}}>
          <Editor
            height="320px"
            defaultLanguage={lesson.language || 'javascript'}
            value={code}
            onChange={(v) => { const val = v || ''; setCode(val); debouncedSave(lesson.id, val); }}
            options={{ wordWrap: 'on', minimap: { enabled: false } }}
          />
          <ExerciseRunner userCode={code} solutionCode={lesson.solutionCode} language={lesson.language || 'javascript'} onSuccess={()=> persist(lesson.id, 'COMPLETED', code)} />
          {token && (
            <div style={{marginTop:'0.75rem', display:'flex', gap:'.5rem'}}>
              <button onClick={()=> persist(lesson.id, 'COMPLETED', code)}>Marquer comme terminé</button>
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

// Simple sandbox runner (only for JS) capturing console.log safely
const RunCode: React.FC<{ code: string; language: string }> = ({ code, language }) => {
  const [output, setOutput] = useState<string>('');
  const run = () => {
    if (language !== 'javascript') { setOutput('Exécution disponible seulement pour JavaScript.'); return; }
    const logs: any[] = [];
    const customConsole = { log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')) };
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function('console', code);
      fn(customConsole);
      setOutput(logs.join('\n'));
    } catch (e: any) {
      setOutput('Erreur: ' + e.message);
    }
  };
  return (
    <div style={{marginTop:'.75rem'}}>
      <button onClick={run}>▶️ Exécuter la démo</button>
      {output && (
        <pre style={{background:'var(--color-bg-alt2)', padding:'.75rem', marginTop:'.5rem', border:'1px solid var(--color-border)', borderRadius:8, maxHeight:200, overflow:'auto'}}>{output}</pre>
      )}
    </div>
  );
};

interface ExerciseRunnerProps {
  userCode: string;
  solutionCode?: string;
  language: string;
  onSuccess?: () => void;
}

const ExerciseRunner: React.FC<ExerciseRunnerProps> = ({ userCode, solutionCode, language, onSuccess }) => {
  const [output, setOutput] = useState<string>('');
  const [expected, setExpected] = useState<string>('');
  const [status, setStatus] = useState<'idle'|'success'|'fail'|'error'>('idle');
  const [showSolution, setShowSolution] = useState(false);

  const captureRun = (code: string) => {
    const logs: string[] = [];
    const c = { log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')) };
    // eslint-disable-next-line no-new-func
    const fn = new Function('console', code);
    fn(c);
    return logs.join('\n');
  };

  const runUser = () => {
    if (language !== 'javascript') { setOutput('Exécution disponible seulement pour JavaScript.'); return; }
    try {
      const out = captureRun(userCode);
      setOutput(out || '(aucune sortie)');
      setStatus('idle');
    } catch (e: any) {
      setOutput('Erreur: ' + e.message);
      setStatus('error');
    }
  };

  const validate = () => {
    if (language !== 'javascript') { setStatus('error'); setOutput('Validation JS uniquement.'); return; }
    if (!solutionCode) { setStatus('error'); setOutput('Pas de solution disponible.'); return; }
    try {
      const userOut = captureRun(userCode).trim();
      const solOut = captureRun(solutionCode).trim();
      setOutput(userOut || '(aucune sortie)');
      setExpected(solOut || '(aucune sortie)');
      if (userOut === solOut) {
        setStatus('success');
        onSuccess && onSuccess();
      } else {
        setStatus('fail');
      }
    } catch (e: any) {
      setStatus('error');
      setOutput('Erreur: ' + e.message);
    }
  };

  return (
    <div style={{marginTop:'1rem'}}>
      <div style={{display:'flex', gap:'.5rem', flexWrap:'wrap'}}>
        <button onClick={runUser}>▶️ Exécuter</button>
        <button onClick={validate}>✅ Vérifier</button>
        {status==='fail' && solutionCode && (
          <button onClick={()=> setShowSolution(s=>!s)}>{showSolution ? 'Cacher solution' : 'Voir solution'}</button>
        )}
      </div>
      {(output || status!=='idle') && (
        <div style={{marginTop:'.6rem', display:'grid', gap:'.6rem'}}>
          <div>
            <div style={{fontSize:'.7rem', textTransform:'uppercase', letterSpacing:'.5px', opacity:.7}}>Sortie</div>
            <pre style={{background:'var(--color-bg-alt2)', padding:'.6rem .7rem', border:'1px solid var(--color-border)', borderRadius:8, maxHeight:180, overflow:'auto'}}>{output}</pre>
          </div>
          {expected && status!=='idle' && (
            <div>
              <div style={{fontSize:'.7rem', textTransform:'uppercase', letterSpacing:'.5px', opacity:.7}}>Attendu</div>
              <pre style={{background:'var(--color-bg-alt2)', padding:'.6rem .7rem', border:'1px solid var(--color-border)', borderRadius:8, maxHeight:120, overflow:'auto'}}>{expected}</pre>
            </div>
          )}
          {status==='success' && <p style={{color:'#10b981', fontSize:'.85rem', fontWeight:600}}>✔ Exercice réussi !</p>}
          {status==='fail' && <p style={{color:'#f59e0b', fontSize:'.85rem', fontWeight:600}}>✖ Ce n'est pas encore ça.</p>}
          {status==='error' && <p style={{color:'#ef4444', fontSize:'.85rem', fontWeight:600}}>⚠ Erreur lors de l'exécution.</p>}
          {showSolution && solutionCode && (
            <div style={{marginTop:'.5rem'}}>
              <div style={{fontSize:'.7rem', textTransform:'uppercase', letterSpacing:'.5px', opacity:.7}}>Solution</div>
              <pre style={{background:'var(--color-bg-alt2)', padding:'.6rem .7rem', border:'1px solid var(--color-border)', borderRadius:8, maxHeight:220, overflow:'auto'}}>{solutionCode}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
