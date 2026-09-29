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

    test('should find a task by id', () => {
        const task = taskService.create({
            title: 'Find this task',
        });

        const foundTask = taskService.findById(task.id);

        expect(foundTask).toBeDefined();
        expect(foundTask.id).toBe(task.id);
        expect(foundTask.title).toBe('Find this task');
    });

    test('should return undefined for a non-existent task', () => {
        const task = taskService.findById('invalid-task-id');

        expect(task).toBeUndefined();
    });

    test('should return null when updating a non-existent task', () => {
        const updatedTask = taskService.update('invalid-task-id', {
            title: 'Updated task',
        });

        expect(updatedTask).toBeNull();
    });

    test('should return false when removing a non-existent task', () => {
        const removed = taskService.remove('invalid-task-id');

        expect(removed).toBe(false);
    });
    test('should return correct task statistics', () => {
        taskService.create({
            title: 'Todo task',
            status: 'todo',
        });

        taskService.create({
            title: 'In progress task',
            status: 'in_progress',
        });

        taskService.create({
            title: 'Completed task',
            status: 'done',
        });

        const stats = taskService.getStats();

        expect(stats.todo).toBe(1);
        expect(stats.in_progress).toBe(1);
        expect(stats.done).toBe(1);
        expect(stats.overdue).toBe(0);
    });

    test('should count overdue tasks', () => {
        taskService.create({
            title: 'Overdue task',
            status: 'todo',
            dueDate: '2020-01-01T00:00:00.000Z',
        });

        taskService.create({
            title: 'Future task',
            status: 'todo',
            dueDate: '2099-01-01T00:00:00.000Z',
        });

        const stats = taskService.getStats();

        expect(stats.overdue).toBe(1);
    });

    test('should ignore unknown statuses in task statistics', () => {
        taskService.create({
            title: 'Unknown status task',
            status: 'unknown',
        });

        const stats = taskService.getStats();

        expect(stats.todo).toBe(0);
        expect(stats.in_progress).toBe(0);
        expect(stats.done).toBe(0);
        expect(stats.overdue).toBe(0);
    });

    test('should assign a task', () => {
        const task = taskService.create({
            title: 'Assign me',
        });

        const updatedTask = taskService.assignTask(
            task.id,
            'Heman'
        );

        expect(updatedTask.id).toBe(task.id);
        expect(updatedTask.assignee).toBe('Heman')

    });

});
