// backend/src/controllers/AuthController.js
import { AuthService } from '../services/AuthService.js';

export class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  login = async (req, res) => {
    try {
      const result = await this.authService.login(req.body);
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }
}