import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import ApperIcon from './components/ApperIcon';
import Project from './pages/Project';
import ProjectDetail from './pages/ProjectDetail';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
              ? `/signup?redirect=${currentPath}`
              : currentPath.includes('/login')
              ? `/login?redirect=${currentPath}`
              : '/login');
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path)))
              navigate(`/login?redirect=${redirectPath}`);
            else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
      }
    });
  }, [dispatch, navigate]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
        <div className="text-center">
          <ApperIcon name="Loader" className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <p className="text-surface-600 dark:text-surface-300">Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen relative">
        {isAuthenticated && (
          <header className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-surface-900 shadow-sm px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <ApperIcon name="CheckSquare" className="h-6 w-6 text-primary" />
              <h1 className="text-lg md:text-xl font-bold text-primary">
                <Link to="/">TaskFlow</Link>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <nav>
                <ul className="flex space-x-6">
                  <li>
                    <Link to="/" className="text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors">Tasks</Link>
                  </li>
                  <li>
                    <Link to="/projects" className="text-surface-600 dark:text-surface-300 hover:text-primary dark:hover:text-primary-light transition-colors">Projects</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center gap-4">
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
              <button 
                onClick={authMethods.logout}
                className="p-2 flex items-center gap-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Logout"
              >
                <ApperIcon name="LogOut" className="h-5 w-5 text-surface-600 dark:text-surface-300" />
                <span className="text-sm font-medium text-surface-600 dark:text-surface-300">Logout</span>
              </button>
            </div>
          </header>
        )}
        
        <main className={isAuthenticated ? "pt-16 pb-8 min-h-screen" : "min-h-screen"}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
            <Route path="/projects" element={isAuthenticated ? <Project /> : <Login />} />
            <Route path="/projects/:projectId" element={isAuthenticated ? <ProjectDetail /> : <Login />} />
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
    </AuthContext.Provider>
  );
}

export default App;