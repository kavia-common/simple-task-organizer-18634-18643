import React, { useMemo } from 'react';
import Button from './Button';

// PUBLIC_INTERFACE
export default function TaskList({ tasks, onEdit, onDelete, onToggle }) {
  /** Renders tasks with edit, delete, and toggle complete. */
  const sorted = useMemo(() => {
    return [...(tasks || [])].sort((a, b) => {
      const aC = a.completed ? 1 : 0;
      const bC = b.completed ? 1 : 0;
      if (aC !== bC) return aC - bC; // incomplete first
      const ad = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bd = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bd - ad; // newest first
    });
  }, [tasks]);

  if (!sorted.length) {
    return <div style={{ padding: '12px 0', color: 'var(--text-primary)' }}>No tasks yet. Add your first task!</div>;
  }

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
      {sorted.map((t) => (
        <li key={t.id || t._id} style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          border: '1px solid var(--border-color)',
          borderRadius: 10,
          padding: 12,
          marginBottom: 10,
          background: 'var(--bg-primary)'
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <input
              type="checkbox"
              checked={!!t.completed}
              onChange={() => onToggle?.(t)}
              aria-label={`Mark ${t.title} as ${t.completed ? 'incomplete' : 'complete'}`}
              style={{ marginTop: 4 }}
            />
            <div>
              <div style={{ fontWeight: 700, textDecoration: t.completed ? 'line-through' : 'none' }}>{t.title}</div>
              {t.description ? (
                <div style={{ color: 'var(--text-primary)', opacity: 0.8, marginTop: 4 }}>{t.description}</div>
              ) : null}
            </div>
          </div>
          <div>
            <Button variant="ghost" onClick={() => onEdit?.(t)}>Edit</Button>
            <Button variant="danger" onClick={() => onDelete?.(t)}>Delete</Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
