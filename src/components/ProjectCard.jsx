import { Link } from 'react-router-dom';
import ApperIcon from './ApperIcon';

/**
 * Component to display a project card with stats
 */
const ProjectCard = ({ project }) => {
  const { name, taskCount, statusCounts } = project;
  
  // Calculate completion percentage
  const completionPercentage = taskCount > 0 
    ? Math.round((statusCounts.completed / taskCount) * 100) 
    : 0;

  return (
    <Link to={`/projects/${encodeURIComponent(name)}`} className="block">
      <div className="card h-full hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center mb-4">
          <div className="p-2 rounded-lg bg-primary bg-opacity-10">
            <ApperIcon name="Folder" className="h-6 w-6 text-primary" />
          </div>
          <h3 className="ml-3 text-lg font-medium">{name}</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-surface-600 dark:text-surface-400">Completion</span>
            <span className="font-medium">{completionPercentage}%</span>
          </div>
          
          <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-surface-600 dark:text-surface-400">
              <span>{taskCount} {taskCount === 1 ? 'task' : 'tasks'}</span>
            </div>
            <ApperIcon name="ArrowRight" className="h-5 w-5 text-surface-400" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;