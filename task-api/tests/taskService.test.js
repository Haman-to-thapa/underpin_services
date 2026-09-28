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

    test('should return the first page of tasks', () => {
        taskService.create({ title: 'Task 1' });
        taskService.create({ title: 'Task 2' });
        taskService.create({ title: 'Task 3' });

        const tasks = taskService.getPaginated(1, 2);

        expect(tasks).toHaveLength(2);
        expect(tasks[0].title).toBe('Task 1');
        expect(tasks[1].title).toBe('Task 2');
    });
});


