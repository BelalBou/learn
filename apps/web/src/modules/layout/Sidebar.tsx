import React from 'react';
import { useCourses } from '../state/useCourses';
import { Link, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { courses } = useCourses();
  const location = useLocation();
  return (
    <aside className="sidebar" aria-label="Navigation des cours">
  <div className="sidebar-header"><h2>Cursus</h2></div>
      {courses.map(course => (
        <div key={course.id} className="sidebar-course-group">
          <details open>
            <summary>{course.title}</summary>
            <ul>
              {course.sections.flatMap(s => s.lessons).map(lesson => (
                <li key={lesson.id}>
                  <Link className={location.pathname === `/lesson/${lesson.id}` ? 'active' : ''} to={`/lesson/${lesson.id}`}>
                    {lesson.title}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </aside>
  );
};
