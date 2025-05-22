/**
 * Task Service
 * 
 * Provides methods for performing CRUD operations on tasks using Apper SDK
 */

// Define the table name based on the provided schema
const TABLE_NAME = 'task2';

/**
 * Fetch tasks with optional filtering and search
 * 
 * @param {Array} filters - Array of filter conditions
 * @param {String} searchQuery - Text to search for in task title and description
 * @returns {Promise<Array>} - Array of task objects
 */
export const fetchTasks = async (filters = [], searchQuery = '') => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Define fields to fetch based on the provided schema
    const fields = [
      'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
      'title', 'description', 'status', 'priority', 'category', 'dueDate', 'createdAt'
    ];

    // Build the where conditions
    const where = [...filters];

    // Add search query filter if provided
    if (searchQuery) {
      // Search in both title and description
      where.push({
        fieldName: "title",
        operator: "Contains",
        values: [searchQuery]
      });
    }

    // Build query parameters
    const params = {
      fields,
      where: where.length > 0 ? where : undefined,
      orderBy: [
        {
          fieldName: "createdAt",
          SortType: "DESC" // Most recent first
        }
      ],
      pagingInfo: {
        limit: 100 // Adjust as needed
      }
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);

    if (!response || !response.data) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

/**
 * Create a new task
 * 
 * @param {Object} taskData - Task data to create
 * @returns {Promise<Object>} - Created task
 */
export const createTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields
    const params = {
      records: [{
        Name: taskData.title || taskData.Name, // Map to the Name field required by Apper
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        category: taskData.category,
        dueDate: taskData.dueDate,
        Tags: taskData.Tags || ''
      }]
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

/**
 * Update an existing task
 * 
 * @param {Object} taskData - Task data to update (must include Id)
 * @returns {Promise<Object>} - Updated task
 */
export const updateTask = async (taskData) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include updateable fields and Id
    const params = {
      records: [{
        Id: taskData.Id || taskData.id,
        Name: taskData.title || taskData.Name, // Map to the Name field required by Apper
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        category: taskData.category,
        dueDate: taskData.dueDate,
        Tags: taskData.Tags || ''
      }]
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * Delete a task by ID
 * 
 * @param {String} taskId - ID of the task to delete
 * @returns {Promise<Object>} - Deletion response
 */
export const deleteTask = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [taskId]
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    return response;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};