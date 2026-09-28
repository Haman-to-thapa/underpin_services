const taskService = require('../src/services/taskService');

describe('Task Service', () => {
    beforeEach(() => {
        taskService._reset();
    });

    test('should create a task', () => {
        const task = taskService.create({
            title: 'Task 1',
            priority: "Learn Jest",
        });

        expect(task.title).toBe('Learn Jest');
        expect(task.priority).toBe('high')
    })
})