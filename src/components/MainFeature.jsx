import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from './ApperIcon';

// Demo data to start with
const initialTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the project proposal for client meeting',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Work'
  },
  {
    id: '2',
    title: 'Grocery shopping',
    description: 'Buy groceries for the week',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    category: 'Personal'
  },
  {
    id: '3',
    title: 'Exercise routine',
    description: '30 minutes cardio workout',
    status: 'Completed',
    priority: 'Low',
    dueDate: new Date().toISOString(),
    category: 'Health'
  }
];

// Priority and status options
const priorityOptions = ['Low', 'Medium', 'High'];
const statusOptions = ['Not Started', 'In Progress', 'Completed'];
const categoryOptions = ['Work', 'Personal', 'Health', 'Learning', 'Other'];

const MainFeature = () => {
  // State management
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : initialTasks;
  });
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Personal'
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Save tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Add a new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty!");
      return;
    }
    
    if (isEditing) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === editingId ? { ...newTask, id: editingId } : task
      );
      setTasks(updatedTasks);
      toast.success("Task updated successfully!");
      setIsEditing(false);
      setEditingId(null);
    } else {
      // Create new task
      const task = {
        ...newTask,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setTasks([task, ...tasks]);
      toast.success("Task added successfully!");
    }
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Personal'
    });
    setShowForm(false);
  };

  // Edit a task
  const handleEdit = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setNewTask({
        ...taskToEdit,
        dueDate: taskToEdit.dueDate.split('T')[0]
      });
      setIsEditing(true);
      setEditingId(id);
      setShowForm(true);
    }
  };

  // Delete a task
  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success("Task deleted successfully!");
  };

  // Toggle task status
  const toggleStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'Completed' ? 'Not Started' : 'Completed';
        const message = newStatus === 'Completed' ? "Task marked as completed!" : "Task reopened!";
        toast.info(message);
        return { ...task, status: newStatus };
      }
      return task;
    }));
  };

  // Filter tasks based on current filters and search
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'All' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-warning';
      case 'Low': return 'badge badge-success';
      default: return 'badge';
    }
  };

  // Get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case 'Work': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      case 'Personal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100';
      case 'Health': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'Learning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-surface-800 dark:text-surface-100">
            Your Tasks
          </h2>
          <p className="text-surface-500 dark:text-surface-400 mt-1">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} available
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-9 w-full sm:w-60"
            />
            <ApperIcon 
              name="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-surface-400" 
            />
          </div>
          
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center justify-center gap-2"
          >
            <ApperIcon name="Plus" size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">
            Status
          </label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="All">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">
            Priority
          </label>
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="input"
          >
            <option value="All">All Priorities</option>
            {priorityOptions.map(priority => (
              <option key={priority} value={priority}>{priority}</option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">
            Category
          </label>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="input"
          >
            <option value="All">All Categories</option>
            {categoryOptions.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Form */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="card mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h3>
            <button 
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setNewTask({
                  title: '',
                  description: '',
                  status: 'Not Started',
                  priority: 'Medium',
                  dueDate: new Date().toISOString().split('T')[0],
                  category: 'Personal'
                });
              }}
              className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
            >
              <ApperIcon name="X" size={18} />
            </button>
          </div>
          
          <form onSubmit={handleAddTask} className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="title" className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">
                Task Title*
              </label>
              <input
                id="title"
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                placeholder="Enter task title"
                className="input"
                required
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newTask.description}
                onChange={handleInputChange}
                placeholder="Enter task description"
                className="input min-h-[80px]"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="status" className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  className="input"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="priority" className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleInputChange}
                  className="input"
                >
                  {priorityOptions.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="category" className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={newTask.category}
                  onChange={handleInputChange}
                  className="input"
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col">
                <label htmlFor="dueDate" className="text-sm font-medium mb-1 text-surface-600 dark:text-surface-400">
                  Due Date
                </label>
                <input
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate}
                  onChange={handleInputChange}
                  className="input"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
              >
                {isEditing ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`card border-l-4 ${
                task.status === 'Completed' 
                  ? 'border-l-green-500 dark:border-l-green-600' 
                  : task.priority === 'High' 
                    ? 'border-l-red-500 dark:border-l-red-600'
                    : task.priority === 'Medium'
                      ? 'border-l-yellow-500 dark:border-l-yellow-600'
                      : 'border-l-blue-500 dark:border-l-blue-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStatus(task.id)}
                    className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center ${
                      task.status === 'Completed'
                        ? 'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600'
                        : 'border-surface-300 dark:border-surface-600'
                    }`}
                  >
                    {task.status === 'Completed' && (
                      <ApperIcon name="Check" className="h-3 w-3 text-white" />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium text-surface-800 dark:text-white ${
                      task.status === 'Completed' ? 'line-through text-surface-500 dark:text-surface-400' : ''
                    }`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className={`mt-1 text-sm text-surface-600 dark:text-surface-300 ${
                        task.status === 'Completed' ? 'line-through text-surface-500 dark:text-surface-400' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}
                    
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className={`badge ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </span>
                      <span className={`badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      {task.status !== 'Completed' && (
                        <span className="badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          {task.status}
                        </span>
                      )}
                      <span className="badge bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200 flex items-center gap-1">
                        <ApperIcon name="Calendar" size={12} />
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 hover:text-primary dark:hover:text-primary-light"
                    aria-label="Edit task"
                  >
                    <ApperIcon name="Edit" size={18} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-1.5 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-500 dark:text-surface-400 hover:text-red-500 dark:hover:text-red-400"
                    aria-label="Delete task"
                  >
                    <ApperIcon name="Trash2" size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="card flex flex-col items-center justify-center py-12 text-center">
            <ApperIcon name="ClipboardList" className="h-16 w-16 text-surface-300 dark:text-surface-700 mb-4" />
            <h3 className="text-xl font-medium text-surface-700 dark:text-surface-300 mb-2">
              No tasks found
            </h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md">
              {searchQuery || filterStatus !== 'All' || filterPriority !== 'All' || filterCategory !== 'All'
                ? "No tasks match your current filters. Try adjusting your search or filters."
                : "You don't have any tasks yet. Add a new task to get started!"}
            </p>
            {(searchQuery || filterStatus !== 'All' || filterPriority !== 'All' || filterCategory !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('All');
                  setFilterPriority('All');
                  setFilterCategory('All');
                }}
                className="mt-4 btn btn-outline"
              >
                Clear Filters
              </button>
            )}
            {!searchQuery && filterStatus === 'All' && filterPriority === 'All' && filterCategory === 'All' && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 btn btn-primary"
              >
                Add Your First Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainFeature;