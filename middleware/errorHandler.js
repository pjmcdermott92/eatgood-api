class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

const errorResponse = (message, statusCode) => {
    return new ErrorResponse(message, statusCode);
};

const notFound = (req, res, next) => {
    return next(errorResponse(`Not Found - ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Mongoose Not Found error
    if (err.name == 'Cast Error' && err.kind == 'ObjectId') {
        error = new errorResponse('Resource not found', 404);
    }

    const errObj = { success: false, message: err.message || 'An error occurred' };

    if (process.env.NODE_ENV !== 'production') {
        errObj.stack = err.stack;
    }

    res.status(err.statusCode || 400).json(errObj);
};

export { notFound, errorHandler };
export default errorResponse;
