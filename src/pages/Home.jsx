import { motion } from 'framer-motion';
import MainFeature from '../components/MainFeature';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center mb-3">
            <div className="bg-primary bg-opacity-10 dark:bg-opacity-20 p-3 rounded-full">
              <ApperIcon name="CheckSquare" className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-surface-800 dark:text-white mb-4">
            Welcome to <span className="text-primary">TaskFlow</span>
          </h1>
          <p className="text-surface-600 dark:text-surface-300 max-w-2xl mx-auto text-lg">
            Organize your tasks efficiently and boost your productivity.
          </p>
        </div>
      </motion.div>
      
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="card bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                <ApperIcon name="ListChecks" className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold">Organize</h3>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-300">
              Create, categorize, and prioritize your tasks to stay organized.
            </p>
          </div>
          
          <div className="card bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg">
                <ApperIcon name="Clock" className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold">Track</h3>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-300">
              Set deadlines and monitor progress to complete tasks on time.
            </p>
          </div>
          
          <div className="card bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-900 border border-surface-200 dark:border-surface-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                <ApperIcon name="Rocket" className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold">Achieve</h3>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-300">
              Complete tasks efficiently and celebrate your productivity wins.
            </p>
          </div>
        </div>
        
        <MainFeature />
      </div>
    </div>
  );
};

export default Home;