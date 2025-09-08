import React, { useEffect, useState } from 'react';
import Button from './Button';

// PUBLIC_INTERFACE
export default function TaskForm({ initial, onCancel, onSave }) {
  /** Form to create or edit a task. */
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [completed, setCompleted] = useState(Boolean(initial?.completed));

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setCompleted(Boolean(initial?.completed));
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.({ title: title.trim(), description: description.trim(), completed });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label>
        Title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border-color)', marginTop: 4 }}
        />
      </label>
      <label>
        Description
        <textarea
          value={description}
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border-color)', marginTop: 4, resize: 'vertical' }}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <input type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
        Completed
      </label>
      <div style={{ marginTop: 8 }}>
        <Button type="submit">{initial ? 'Save' : 'Add Task'}</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
