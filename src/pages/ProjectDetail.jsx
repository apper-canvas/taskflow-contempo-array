import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fetchProjectTasks } from '../services/ProjectService';
import ApperIcon from '../components/ApperIcon';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjectTasks = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const projectName = decodeURIComponent(projectId);
        const tasksData = await fetchProjectTasks(projectName);
        setTasks(tasksData);
        setFilteredTasks(tasksData);
      } catch (err) {
        setError('Failed to load project tasks. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjectTasks();
  }, [projectId]);

  // Filter tasks when status filter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => {
        if (statusFilter === 'notStarted') return task.status === 'Not Started';
        if (statusFilter === 'inProgress') return task.status === 'In Progress';
        if (statusFilter === 'completed') return task.status === 'Completed';
        return true;
      }));
    }
  }, [statusFilter, tasks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <ApperIcon name="Loader" className="h-10 w-10 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // Get status counts for the sidebar
  const notStartedCount = tasks.filter(t => t.status === 'Not Started').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const completedCount = tasks.filter(t => t.status === 'Completed').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/projects" className="text-primary mr-4">
          <ApperIcon name="ArrowLeft" className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">{decodeURIComponent(projectId)}</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar with filters */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-lg font-medium mb-4">Status</h2>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setStatusFilter('all')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${statusFilter === 'all' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-800'}`}
                >
                  <span>All Tasks</span>
                  <span className="bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-full text-xs">{tasks.length}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setStatusFilter('notStarted')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${statusFilter === 'notStarted' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-800'}`}
                >
                  <span>Not Started</span>
                  <span className="bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-full text-xs">{notStartedCount}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setStatusFilter('inProgress')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${statusFilter === 'inProgress' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-800'}`}
                >
                  <span>In Progress</span>
                  <span className="bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-full text-xs">{inProgressCount}</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setStatusFilter('completed')}
                  className={`w-full text-left px-3 py-2 rounded-lg flex justify-between items-center ${statusFilter === 'completed' ? 'bg-primary/10 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-800'}`}
                >
                  <span>Completed</span>
                  <span className="bg-surface-200 dark:bg-surface-700 px-2 py-0.5 rounded-full text-xs">{completedCount}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Main content with task list */}
        <div className="lg:col-span-3">
          <div className="card">
            <h2 className="text-lg font-medium mb-4">Tasks</h2>
            
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-surface-500 dark:text-surface-400">
                <ApperIcon name="FileQuestion" className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No tasks found with the selected filter.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <div key={task.Id} className="border-b border-surface-200 dark:border-surface-700 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{task.title || task.Name}</h3>
                        <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">{task.description}</p>
                      </div>
                      <div className={`
                        badge ${task.status === 'Completed' 
                          ? 'badge-success' 
                          : task.status === 'In Progress' 
                            ? 'badge-warning' 
                            : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300'}
                      `}>
                        {task.status}
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-3 text-sm text-surface-500 dark:text-surface-400">
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Calendar" className="h-4 w-4" />
                          <span>{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {task.priority && (
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Flag" className="h-4 w-4" />
                          <span>{task.priority}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;