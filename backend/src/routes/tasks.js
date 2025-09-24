// backend/src/routes/tasks.js
import express from 'express';
import { body } from 'express-validator';
import { TaskController } from '../controllers/TaskController.js';
import { authenticateToken } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();
const taskController = new TaskController();

const taskValidation = [
  body('title').notEmpty().trim(),
  body('projectId').isMongoId(),
  body('status').isIn(['todo', 'in-progress', 'done']).optional(),
  body('priority').isIn(['low', 'medium', 'high']).optional()
];

router.use(authenticateToken);

router.post('/', taskValidation, handleValidationErrors, taskController.createTask);
router.get('/project/:projectId', taskController.getProjectTasks);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);
router.get('/dashboard/stats', taskController.getDashboardStats);

export default router;