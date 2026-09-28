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
});