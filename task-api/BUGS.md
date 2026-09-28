# Bug Report

## Bug 1: Pagination starts from the wrong offset

### Location
`src/services/taskService.js` → `getPaginated()`

### Problem
The pagination offset is calculated using:

`page * limit`

For page 1, this starts at index equal to the limit and skips the first page of tasks.

### Expected Behavior
When requesting page 1 with a limit of 2, the API should return the first two tasks:

- Task 1
- Task 2

### Actual Behavior
The first task is skipped and the test receives a later task.

### How the Bug Was Discovered
A Jest test was created for the first page of paginated tasks. The test failed because the returned task did not match the expected first task.

### Fix
Change the offset calculation to:

`(page - 1) * limit`