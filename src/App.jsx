import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ApperIcon from './components/ApperIcon';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className="min-h-screen relative">
      <header className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-surface-900 shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <ApperIcon name="CheckSquare" className="h-6 w-6 text-primary" />
          <h1 className="text-lg md:text-xl font-bold text-primary">TaskFlow</h1>
        </div>
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <ApperIcon name="Sun" className="h-5 w-5 text-yellow-400" />
          ) : (
            <ApperIcon name="Moon" className="h-5 w-5 text-surface-600" />
          )}
        </button>
      </header>
      
      <main className="pt-16 pb-8 min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
      />
    </div>
  );
}

export default App;