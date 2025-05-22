import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProjects, fetchProjectTasks } from '../services/ProjectService';
import ApperIcon from '../components/ApperIcon';
import ProjectCard from '../components/ProjectCard';

const Project = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all projects on component mount
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await fetchProjects();
        setProjects(projectsData);
        
        // If we have a projectId from URL, load that project's tasks
        if (projectId) {
          const decodedProjectId = decodeURIComponent(projectId);
          setSelectedProject(decodedProjectId);
          const tasks = await fetchProjectTasks(decodedProjectId);
          setProjectTasks(tasks);
        }
      } catch (err) {
        setError('Failed to load projects. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadProjects();
  }, [projectId]);

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

  // If a specific project is selected, render the project detail
  if (selectedProject) {
    navigate(`/projects/${encodeURIComponent(selectedProject)}`);
  }

  // Otherwise render the projects list
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link to="/" className="btn btn-outline flex items-center gap-2">
          <ApperIcon name="List" className="h-5 w-5" />
          <span>View Tasks</span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Project;