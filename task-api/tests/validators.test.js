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
});