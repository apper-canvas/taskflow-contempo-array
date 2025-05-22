import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '../components/ApperIcon';

const NotFound = () => {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-center">
          <div className="relative">
            <div className="text-9xl font-bold text-surface-200 dark:text-surface-800">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ApperIcon name="FileQuestion" className="h-20 w-20 text-primary" />
            </div>
          </div>
        </div>
      </motion.div>
      
      <h1 className="text-3xl md:text-4xl font-bold text-surface-800 dark:text-white mb-4">
        Page Not Found
      </h1>
      
      <p className="text-surface-600 dark:text-surface-300 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>
      
      <Link 
        to="/"
        className="btn btn-primary flex items-center gap-2"
      >
        <ApperIcon name="Home" size={18} />
        <span>Go Back Home</span>
      </Link>
    </div>
  );
};

export default NotFound;