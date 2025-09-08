import React from 'react';

const styles = {
  base: {
    padding: '10px 12px',
    borderRadius: 8,
    margin: '8px 0',
    border: '1px solid'
  },
  success: {
    background: '#e6ffed',
    borderColor: '#34c759',
    color: '#0a6d2b'
  },
  error: {
    background: '#ffe6e6',
    borderColor: '#ff3b30',
    color: '#8e1b13'
  },
  info: {
    background: '#e6f0ff',
    borderColor: '#007bff',
    color: '#0b409c'
  }
};

// PUBLIC_INTERFACE
export default function Alert({ type = 'info', children }) {
  /** Simple alert box: type info|success|error */
  const style = { ...styles.base, ...(styles[type] || styles.info) };
  return <div style={style}>{children}</div>;
}
