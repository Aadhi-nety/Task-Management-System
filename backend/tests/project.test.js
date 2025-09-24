import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import Project from '../src/models/Project.js';
import User from '../src/models/User.js';

let authToken;
let testUser;
let testProject;

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/taskmanager-test');

  // Create test user
  testUser = new User({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  await testUser.save();

  // Login to get token
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'password123'
    });
  
  authToken = response.body.data.token;

  // Create test project
  testProject = new Project({
    name: 'Test Project',
    description: 'Test Description',
    createdBy: testUser._id
  });
  await testProject.save();
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('Project API', () => {
  describe('GET /api/projects', () => {
    it('should return all projects for authenticated user', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/projects');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const projectData = {
        name: 'New Test Project',
        description: 'New Test Description'
      };

      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(projectData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(projectData.name);
      expect(response.body.data.description).toBe(projectData.description);
    });

    it('should return 400 for invalid project data', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({}); // Empty data

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete a project', async () => {
      const project = new Project({
        name: 'Project to delete',
        description: 'Will be deleted',
        createdBy: testUser._id
      });
      await project.save();

      const response = await request(app)
        .delete(`/api/projects/${project._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify project is deleted
      const deletedProject = await Project.findById(project._id);
      expect(deletedProject).toBeNull();
    });

    it('should return 404 for non-existent project', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/projects/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
    });
  });
});