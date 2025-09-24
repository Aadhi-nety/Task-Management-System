// backend/tests/task.test.js
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
  it('should create a new task', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Task',
        description: 'Test Description',
        projectId: testProject._id,
        priority: 'high'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Test Task');
  });

  it('should get tasks for a project', async () => {
    const response = await request(app)
      .get(`/api/tasks/project/${testProject._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.tasks)).toBe(true);
  });
});