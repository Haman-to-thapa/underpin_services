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

    test('GET /tasks?page=1&limit=2 should return the first two tasks', async () => {
        await request(app)
            .post('/tasks')
            .send({ title: 'Task 1' });

        await request(app)
            .post('/tasks')
            .send({ title: 'Task 2' });

        await request(app)
            .post('/tasks')
            .send({ title: 'Task 3' });

        const response = await request(app)
            .get('/tasks')
            .query({ page: 1, limit: 2 });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(response.body[0].title).toBe('Task 1');
        expect(response.body[1].title).toBe('Task 2');
    });

    test('GET /tasks/stats should return task statistics', async () => {
        await request(app)
            .post('/tasks')
            .send({
                title: 'Todo Task',
                status: 'todo',
            });

        await request(app)
            .post('/tasks')
            .send({
                title: 'In Progress Task',
                status: 'in_progress',
            });

        await request(app)
            .post('/tasks')
            .send({
                title: 'Completed Task',
                status: 'done',
            });

        const response = await request(app).get('/tasks/stats');

        expect(response.statusCode).toBe(200);
        expect(response.body.todo).toBe(1);
        expect(response.body.in_progress).toBe(1);
        expect(response.body.done).toBe(1);
        expect(response.body.overdue).toBe(0);
    });

    test('PUT /tasks/:id should update an existing task', async () => {
        const createResponse = await request(app)
            .post('/tasks')
            .send({
                title: 'Original Task',
                priority: 'low',
            });

        const taskId = createResponse.body.id;

        const response = await request(app)
            .put(`/tasks/${taskId}`)
            .send({
                title: 'Updated Task',
                priority: 'high',
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(taskId);
        expect(response.body.title).toBe('Updated Task');
        expect(response.body.priority).toBe('high');
    });

    test('PUT /tasks/:id should return 404 for a non-existent task', async () => {
        const response = await request(app)
            .put('/tasks/non-existent-id')
            .send({
                title: 'Updated Task',
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Task not found');
    });
});