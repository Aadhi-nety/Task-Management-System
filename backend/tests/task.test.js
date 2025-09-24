import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/server.js';
import Task from '../src/models/Task.js';
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

describe('Task API', () => {
  let testTask;

  beforeEach(async () => {
    // Create a test task before each test
    testTask = new Task({
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'medium',
      projectId: testProject._id,
      createdBy: testUser._id
    });
    await testTask.save();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Test Task',
        description: 'New Test Description',
        priority: 'high',
        projectId: testProject._id
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.priority).toBe(taskData.priority);
    });

    it('should return 400 for invalid task data', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: '' }); // Invalid data

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tasks/project/:projectId', () => {
    it('should return tasks for a project', async () => {
      const response = await request(app)
        .get(`/api/tasks/project/${testProject._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tasks)).toBe(true);
      expect(response.body.data.tasks.length).toBeGreaterThan(0);
    });

    it('should filter tasks by status', async () => {
      const response = await request(app)
        .get(`/api/tasks/project/${testProject._id}?status=todo`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.tasks.every(task => task.status === 'todo')).toBe(true);
    });
  });

  describe('PATCH /api/tasks/:id/status', () => {
    it('should update task status', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'in-progress' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('in-progress');
    });

    it('should return 400 for invalid status', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${testTask._id}/status`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'invalid-status' });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTask._id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify task is deleted
      const deletedTask = await Task.findById(testTask._id);
      expect(deletedTask).toBeNull();
    });
  });
});
