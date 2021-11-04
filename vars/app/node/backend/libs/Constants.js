module.exports = Object.freeze({
    SALT_WORK_FACTOR: 10,
    ALGORITHM: 'aes-256-ctr',
    EXPIRES: 4320,
    VERIFICATION_EXPIRES: 24,
    messages: {
        FORBIDDEN: 'Forbidden request',
        AUTHEN_SUCCESS: 'Authentication success.',
        AUTHEN_FAIL: 'Bad credentials.',
        NO_TOKEN_FOUND: 'Token was not found.',
        CREATE_PROJECT_SUCCESS: 'The project has been created.',
        READ_ALL_PROJECT_SUCCESS: 'The list of projects have been read.',
        UPDATE_PROJECT_SUCCESS: 'The project has been updated.',
        DELETE_PROJECT_SUCESS: 'The project has been deleted.',
        PROJECT_NOT_FOUND: 'The project was not found.',
        READ_ALL_USER_SUCCESS: 'The list of users have been read.',
        CREATE_USER_SUCCESS: 'The user has been created.',
        DUPLICATE_USERNAME: 'The username already existes.',
        UPDATE_USER_SUCCESS: 'The user has been updated.',
        USER_NOT_FOUND: 'The user was not found.',
        DELETE_USER_SUCESS: 'The user has been deleted.',
        SELF_DELETE_ERROR: 'Can not self-delete.',
        CREATE_TASK_SUCCESS: 'The task has been created.',
        READ_ALL_TASK_SUCCESS: 'The list of tasks have been read.',
        UPDATE_TASK_SUCCESS: 'The task has been updated.',
        TASK_NOT_FOUND: 'The task was not found.',
        DELETE_TASK_SUCCESS: 'The task has been deleted.'
    }
});
