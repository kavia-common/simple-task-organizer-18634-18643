import React from 'react';

// PUBLIC_INTERFACE
export default function Button({ children, onClick, type = 'button', variant = 'primary', ...rest }) {
  /** Simple button with primary/secondary variants */
  const base = {
    cursor: 'pointer',
    padding: '10px 14px',
    borderRadius: 8,
    border: 'none',
    fontWeight: 600,
    marginRight: 8
  };
  const variants = {
    primary: { backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' },
    secondary: { backgroundColor: '#6c757d', color: '#fff' },
    danger: { backgroundColor: '#dc3545', color: '#fff' },
    ghost: { backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }
  };
  const style = { ...base, ...(variants[variant] || variants.primary) };
  return (
    <button type={type} onClick={onClick} style={style} {...rest}>
      {children}
    </button>
  );
}
