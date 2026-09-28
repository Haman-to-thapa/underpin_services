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

    test('should return tasks by status', () => {
        taskService.create({
            title: 'Task 1',
            status: 'todo',
        });

        taskService.create({
            title: 'Task 2',
            status: 'done',
        });

        taskService.create({
            title: 'Task 3',
            status: 'todo',
        });

        const tasks = taskService.getByStatus('todo');

        expect(tasks).toHaveLength(2);
        expect(tasks[0].title).toBe('Task 1');
        expect(tasks[1].title).toBe('Task 3');
    });

    test('should update a task', () => {
        const task = taskService.create({
            title: 'Learn Jest',
            priority: 'medium',
        });

        const updatedTask = taskService.update(task.id, {
            title: 'Learn Jest Properly',
            priority: 'high',
        });

        expect(updatedTask.title).toBe('Learn Jest Properly');
        expect(updatedTask.priority).toBe('high');
        expect(updatedTask.id).toBe(task.id);
    });
    test('should remove a task', () => {
        const task = taskService.create({
            title: 'Task to delete',
        });

        const removed = taskService.remove(task.id);

        expect(removed).toBe(true);
        expect(taskService.findById(task.id)).toBeUndefined();
    });
    test('should complete a task', () => {
        const task = taskService.create({
            title: 'Complete this task',
            priority: 'high',
        });

        const completedTask = taskService.completeTask(task.id);

        expect(completedTask.status).toBe('done');
        expect(completedTask.completedAt).not.toBeNull();
        expect(completedTask.id).toBe(task.id);
    });

});


