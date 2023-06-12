module.exports = {
    400: {
        statusCode: 400,
        error: new Error('all fields are mandatory'),
    },
    wrong_data: {
        statusCode: 400,
        error: new Error('username or password incorrects'),
    },
    pass_length: {
        statusCode: 400,
        error: new Error('password length must be at least 4'),
    },
    401: {
        statusCode: 401,
        error: new Error('unauthorized'),
    },
    cors: {
        statusCode: 401,
        error: new Error('unauthorized by CORS error'),
    },
    404: {
        statusCode: 404,
        error: new Error('path not found'),
    },
    500: {
        statusCode: 500,
        error: new Error('something went wrong!'),
    },
    short_url: {
        statusCode: 400,
        error: new Error('the inserted URL must have at least 8 characters')
    },
    url_not_found: {
        statusCode: 400,
        error: new Error('the URL does not exist')
    }
}