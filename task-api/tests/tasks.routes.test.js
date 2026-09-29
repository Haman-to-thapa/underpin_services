const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API Routes', () => {
    beforeEach(() => {
        taskService._reset();
    });

    test('GET /tasks should return an empty array initially', async () => {
        const response = await request(app).get('/tasks');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /tasks should create a new task', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
                title: 'Learn Supertest',
                description: 'Practice API testing',
                priority: 'high',
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe('Learn Supertest');
        expect(response.body.description).toBe('Practice API testing');
        expect(response.body.priority).toBe('high');
        expect(response.body.status).toBe('todo');
        expect(response.body.id).toBeDefined();
    });

    test('POST /tasks should reject a task without a title', async () => {
        const response = await request(app)
            .post('/tasks')
            .send({
                description: 'Task without title',
                priority: 'high',
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(
            'title is required and must be a non-empty string'
        );
    });

    test('GET /tasks should return all tasks', async () => {
        await request(app)
            .post('/tasks')
            .send({
                title: 'Task 1',
                priority: 'high',
            });

        await request(app)
            .post('/tasks')
            .send({
                title: 'Task 2',
                priority: 'low',
            });

        const response = await request(app).get('/tasks');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].title).toBe('Task 1');
        expect(response.body[1].title).toBe('Task 2');
    });

    test('GET /tasks?status=todo should return only todo tasks', async () => {
        await request(app)
            .post('/tasks')
            .send({
                title: 'Todo Task',
                status: 'todo',
            });

        await request(app)
            .post('/tasks')
            .send({
                title: 'Done Task',
                status: 'done',
            });

        const response = await request(app)
            .get('/tasks')
            .query({ status: 'todo' });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].title).toBe('Todo Task');
        expect(response.body[0].status).toBe('todo');
    });
});