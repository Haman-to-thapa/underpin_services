const {
    validateCreateTask,
    validateUpdateTask,
} = require('../src/utils/validators');

describe('Task Validators', () => {
    test('should accept valid task data', () => {
        const error = validateCreateTask({
            title: 'Learn Jest',
            status: 'todo',
            priority: 'high',
            dueDate: '2026-10-01T00:00:00.000Z',
        });

        expect(error).toBeNull();
    });
    test('should reject a task without a title', () => {
        const error = validateCreateTask({
            priority: 'high',
        });

        expect(error).toBe('title is required and must be a non-empty string');
    });
    test('should reject a task with an empty title', () => {
        const error = validateCreateTask({
            title: '   ',
            priority: 'high',
        });

        expect(error).toBe('title is required and must be a non-empty string');
    });

    test('should reject an invalid status', () => {
        const error = validateCreateTask({
            title: 'Learn Jest',
            status: 'invalid_status',
        });

        expect(error).toBe('status must be one of: todo, in_progress, done');
    });

    test('should reject an invalid priority', () => {
        const error = validateCreateTask({
            title: 'Learn Jest',
            priority: 'invalid_priority',
        });

        expect(error).toBe('priority must be one of: low, medium, high');
    });

    test('should reject an invalid dueDate', () => {
        const error = validateCreateTask({
            title: 'Learn Jest',
            dueDate: 'not-a-date',
        });

        expect(error).toBe('dueDate must be a valid ISO date string');
    });

    test('should accept valid update task data', () => {
        const error = validateUpdateTask({
            title: 'Updated Task',
            status: 'in_progress',
            priority: 'high',
            dueDate: '2026-10-15T00:00:00.000Z',
        });

        expect(error).toBeNull();
    });
});