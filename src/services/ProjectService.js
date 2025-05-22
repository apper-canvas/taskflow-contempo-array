/**
 * Service for handling project-related operations
 * Projects are simulated using the task categories
 */

import { toast } from 'react-toastify';

/**
 * Fetch all projects (categories) and calculate statistics
 */
export const fetchProjects = async () => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // First fetch all categories (which will represent our projects)
    const params = {
      fields: ["category", "status"],
      groupBy: ["category"],
    };

    const response = await apperClient.fetchRecords("task2", params);
    
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }

    // Now fetch task counts and status distributions for each category
    const projectsPromises = response.data.map(async (categoryItem) => {
      const category = categoryItem.category;
      
      if (!category) return null;
      
      // Get task count by status for this category
      const statusParams = {
        fields: ["status", "priority", "dueDate"],
        where: [
          {
            fieldName: "category",
            operator: "ExactMatch",
            values: [category]
          }
        ]
      };
      
      const statusResponse = await apperClient.fetchRecords("task2", statusParams);
      
      if (!statusResponse || !statusResponse.data) {
        return {
          name: category,
          taskCount: 0,
          statusCounts: {
            notStarted: 0,
            inProgress: 0,
            completed: 0
          }
        };
      }
      
      const tasks = statusResponse.data;
      
      // Calculate status distribution
      const statusCounts = {
        notStarted: tasks.filter(t => t.status === "Not Started").length,
        inProgress: tasks.filter(t => t.status === "In Progress").length,
        completed: tasks.filter(t => t.status === "Completed").length
      };
      
      return {
        name: category,
        taskCount: tasks.length,
        statusCounts
      };
    });
    
    // Wait for all promises to resolve
    const projects = (await Promise.all(projectsPromises)).filter(p => p !== null);
    return projects;

  } catch (error) {
    console.error("Error fetching projects:", error);
    toast.error("Failed to load projects. Please try again.");
    return [];
  }
};

/**
 * Fetch tasks for a specific project (category)
 */
export const fetchProjectTasks = async (projectName) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const params = {
      fields: ["Id", "Name", "title", "description", "status", "priority", "dueDate", "Tags"],
      where: [
        {
          fieldName: "category",
          operator: "ExactMatch",
          values: [projectName]
        }
      ]
    };
    
    const response = await apperClient.fetchRecords("task2", params);
    return response?.data || [];
  } catch (error) {
    console.error(`Error fetching tasks for project ${projectName}:`, error);
    toast.error("Failed to load project tasks. Please try again.");
    return [];
  }
};