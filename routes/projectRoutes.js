// Import the Express framework
import express from 'express';

// Import controller functions for handling todo-related operations
import { createProject, getProjects,getProjectsByOwner, findProjectById, updateProject, deleteProject , updateProjectInteraction} from "../controllers/projectController.js";

// Import the protect middleware for route protection with JWT authentication
import protect from '../middleware/authMiddleware.js';

// Create an instance of the Express Router
const router = express.Router();

// Define routes and associated middleware/handlers

// POST route to create a new todo, protected by JWT authentication
router.post('/projects', protect, createProject);

// GET route to retrieve all projects, protected by JWT authentication
router.get('/projects', getProjects);
router.get('/projectsbyowner/:id', getProjectsByOwner);

// GET route to retrieve a specific project by ID, protected by JWT authentication
router.get('/projects/:id', findProjectById);

// PUT route to update a specific project by ID, protected by JWT authentication
router.put('/projects/:id', protect, updateProject);
router.put('/projects/likes/comments/:id', updateProjectInteraction);
// DELETE route to delete a specific project by ID, protected by JWT authentication
router.delete('/projects/:id', protect, deleteProject);

// Export the configured router for use in other files
export default router;
