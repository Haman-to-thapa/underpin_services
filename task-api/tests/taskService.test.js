const taskService = require('../src/services/taskService');

describe('Task Service', () => {
    beforeEach(() => {
        taskService._reset();
    });

    test('should create a task', () => {
        const task = taskService.create({
            title: 'Learn Jest',
            priority: 'high',
        });

        expect(task.title).toBe('Learn Jest');
        expect(task.priority).toBe('high');
    });
});