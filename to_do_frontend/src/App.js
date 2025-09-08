import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import Loader from './components/Loader';
import Alert from './components/Alert';
import Button from './components/Button';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { clearAuthToken, getAuthToken } from './config';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';

// PUBLIC_INTERFACE
function App() {
  /** Root application component with authentication and tasks UI. */
  const [theme, setTheme] = useState('light');
  const [authed, setAuthed] = useState(!!getAuthToken());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // login | signup

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!authed) {
      setTasks([]);
      return;
    }
    (async () => {
      setLoading(true);
      setErr('');
      try {
        const data = await getTasks();
        setTasks(Array.isArray(data) ? data : (data?.items || []));
      } catch (error) {
        setErr(error.message || 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    })();
  }, [authed]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const title = useMemo(() => 'Simple To Do', []);

  const onLoggedIn = () => {
    setAuthed(true);
  };

  const doLogout = () => {
    clearAuthToken();
    setAuthed(false);
    setOk('Logged out.');
  };

  const handleCreate = async (payload) => {
    setErr('');
    setOk('');
    try {
      const created = await createTask(payload);
      setTasks(prev => [created, ...prev]);
      setOk('Task created.');
      setShowCreate(false);
    } catch (error) {
      setErr(error.message || 'Failed to create task');
    }
  };

  const handleEdit = async (payload) => {
    if (!editing) return;
    setErr('');
    setOk('');
    try {
      const id = editing.id || editing._id;
      const updated = await updateTask(id, payload);
      setTasks(prev => prev.map(t => (t.id === id || t._id === id) ? updated : t));
      setOk('Task updated.');
      setEditing(null);
    } catch (error) {
      setErr(error.message || 'Failed to update task');
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete task "${task.title}"?`)) return;
    setErr('');
    setOk('');
    try {
      const id = task.id || task._id;
      await deleteTask(id);
      setTasks(prev => prev.filter(t => (t.id || t._id) !== id));
      setOk('Task deleted.');
    } catch (error) {
      setErr(error.message || 'Failed to delete task');
    }
  };

  const handleToggle = async (task) => {
    const id = task.id || task._id;
    try {
      const updated = await updateTask(id, { ...task, completed: !task.completed });
      setTasks(prev => prev.map(t => (t.id === id || t._id === id) ? updated : t));
    } catch (error) {
      setErr(error.message || 'Failed to update task status');
    }
  };

  return (
    <div className="App">
      <header className="App-header" style={{ padding: 20 }}>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <h1 style={{ marginBottom: 0 }}>{title}</h1>
        <p style={{ marginTop: 6, opacity: 0.8 }}>Create, manage, and organize your tasks efficiently.</p>

        {!authed ? (
          <div style={{
            display: 'flex',
            gap: 20,
            marginTop: 20,
            width: '100%',
            maxWidth: 900,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 1, minWidth: 280, maxWidth: 420 }}>
              {authMode === 'login' ? (
                <LoginForm onSuccess={onLoggedIn} />
              ) : (
                <SignupForm onSuccess={onLoggedIn} />
              )}
              <div style={{ marginTop: 10 }}>
                {authMode === 'login' ? (
                  <Button variant="ghost" onClick={() => setAuthMode('signup')}>Need an account? Sign up</Button>
                ) : (
                  <Button variant="ghost" onClick={() => setAuthMode('login')}>Have an account? Log in</Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: 900, marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div />
              <div>
                <Button variant="secondary" onClick={() => setShowCreate(true)}>Add Task</Button>
                <Button variant="ghost" onClick={doLogout}>Logout</Button>
              </div>
            </div>

            {err && <Alert type="error">{err}</Alert>}
            {ok && <Alert type="success">{ok}</Alert>}

            {loading ? (
              <Loader />
            ) : (
              <>
                {showCreate && (
                  <div style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 12,
                    background: 'var(--bg-primary)'
                  }}>
                    <h3 style={{ marginTop: 0 }}>New Task</h3>
                    <TaskForm
                      onCancel={() => setShowCreate(false)}
                      onSave={handleCreate}
                    />
                  </div>
                )}

                {editing && (
                  <div style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    padding: 12,
                    marginBottom: 12,
                    background: 'var(--bg-primary)'
                  }}>
                    <h3 style={{ marginTop: 0 }}>Edit Task</h3>
                    <TaskForm
                      initial={editing}
                      onCancel={() => setEditing(null)}
                      onSave={handleEdit}
                    />
                  </div>
                )}

                <TaskList
                  tasks={tasks}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
