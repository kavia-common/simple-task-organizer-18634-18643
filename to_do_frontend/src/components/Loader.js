import React from 'react';

// PUBLIC_INTERFACE
export default function Loader({ text = 'Loading...' }) {
  /** Simple loader component. */
  return (
    <div role="status" aria-live="polite" style={{ padding: 12, color: 'var(--text-primary)' }}>
      {text}
    </div>
  );
}
