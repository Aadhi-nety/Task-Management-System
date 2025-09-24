// backend/src/routes/projects.js
import express from 'express';
import { body } from 'express-validator';
import { ProjectController } from '../controllers/ProjectController.js';
import { authenticateToken } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();
const projectController = new ProjectController();

const projectValidation = [
  body('name').notEmpty().trim(),
  body('description').optional().trim()
];

router.use(authenticateToken);

router.post('/', projectValidation, handleValidationErrors, projectController.createProject);
router.get('/', projectController.getProjects);
router.delete('/:id', projectController.deleteProject);

export default router;