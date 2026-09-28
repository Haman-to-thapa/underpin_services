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
});