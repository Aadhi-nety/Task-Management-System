// backend/src/services/AuthService.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export class AuthService {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key';
  }

  generateToken(userId) {
    return jwt.sign({ userId }, this.secret, { expiresIn: '7d' });
  }

  verifyToken(token) {
    return jwt.verify(token, this.secret);
  }

  async register(userData) {
    try {
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { username: userData.username }]
      });

      if (existingUser) {
        throw new Error('User already exists with this email or username');
      }

      const user = new User(userData);
      await user.save();

      const token = this.generateToken(user._id);

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async login(credentials) {
    try {
      const { email, password } = credentials;
      
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      const token = this.generateToken(user._id);

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        },
        token
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }
}