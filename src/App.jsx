import React, { useEffect, useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline, Box, Container } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Status from './components/Status/Status';
import Interviews from './components/Interviews/Interviews';
import Resume from './components/Resume/Resume';
import Navbar from './components/Layout/Navbar';
import { makeTheme } from './theme';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [view, setView] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(0);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('themeMode') === 'dark');
  const theme = useMemo(() => makeTheme(darkMode ? 'dark' : 'light'), [darkMode]);
  const toggleTheme = () => setDarkMode(v => { localStorage.setItem('themeMode', !v ? 'dark' : 'light'); return !v; });
  useEffect(() => {
    const clearSession = () => setToken(null);
    window.addEventListener('auth-expired', clearSession);
    return () => window.removeEventListener('auth-expired', clearSession);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'dashboard') {
      setDashboardKey(prev => prev + 1); // Force dashboard refresh
    }
  };

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh' }}>
          {showRegister ? (
            <Register setShowRegister={setShowRegister} />
          ) : (
            <Login setToken={setToken} setShowRegister={setShowRegister} />
          )}
        </Box>
        <ToastContainer position="top-right" autoClose={3000} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        <Navbar onLogout={handleLogout} setView={handleViewChange} currentView={view} darkMode={darkMode} onToggleTheme={toggleTheme} />
        <Container sx={{ py: { xs: 3, sm: 4, md: 5 } }}>
          {view === 'dashboard' && <Dashboard key={dashboardKey} setView={handleViewChange} />}
          {view === 'status' && <Status onChanged={() => setDashboardKey(prev => prev + 1)} />}
          {view === 'interviews' && <Interviews onChanged={() => setDashboardKey(prev => prev + 1)} />}
          {view === 'resume' && <Resume />}
        </Container>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
