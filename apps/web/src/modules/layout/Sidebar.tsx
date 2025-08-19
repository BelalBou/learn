import React from 'react';
import { useCourses } from '../state/useCourses';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC<{open?: boolean; onNavigate?: () => void}> = ({ open, onNavigate }) => {
  const { courses } = useCourses();
  const location = useLocation();
  return (
  <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Navigation des cours" role="navigation">
  <button
    className="sidebar-close mobile-only"
    aria-label="Fermer la navigation"
    type="button"
    onClick={(e)=> { e.stopPropagation(); onNavigate && onNavigate(); }}
  />
  <div className="sidebar-header"><h2>Cursus</h2></div>
      {courses.map(course => (
        <div key={course.id} className="sidebar-course-group">
          <details open>
            <summary>{course.title}</summary>
            <ul>
              {course.sections.flatMap(s => s.lessons).map(lesson => {
                const target = `/app/lesson/${lesson.id}`;
                return (
                  <li key={lesson.id}>
          <Link className={location.pathname === target ? 'active' : ''} to={target} onClick={onNavigate}>
                      {lesson.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        </div>
      ))}
    </aside>
  );
};
