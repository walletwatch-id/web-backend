export class HttpError extends Error {
  public statusCode: number;
  public data?: unknown;

  public constructor(statusCode: number, message: string, data?: unknown, options?: ErrorOptions) {
    super(message, options);

    this.statusCode = statusCode;
    this.data = data;
  }
}

export class BadRequestError extends HttpError {
  public constructor(message: string = 'Bad request.', data?: unknown, options?: ErrorOptions) {
    super(400, message, data, options);
  }
}

export class UnauthorizedError extends HttpError {
  public constructor(message: string = 'Unauthorized.', data?: unknown, options?: ErrorOptions) {
    super(401, message, data, options);
  }
}

export class ForbiddenError extends HttpError {
  public constructor(message: string = 'Forbidden.', data?: unknown, options?: ErrorOptions) {
    super(403, message, data, options);
  }
}

export class NotFoundError extends HttpError {
  public constructor(message: string = 'Not found.', data?: unknown, options?: ErrorOptions) {
    super(404, message, data, options);
  }
}

export class MethodNotAllowedError extends HttpError {
  public constructor(
    message: string = 'Method not allowed.',
    data?: unknown,
    options?: ErrorOptions,
  ) {
    super(405, message, data, options);
  }
}

export class ConflictError extends HttpError {
  public constructor(message: string = 'Conflict.', data?: unknown, options?: ErrorOptions) {
    super(409, message, data, options);
  }
}

export class SessionExpiredError extends HttpError {
  public constructor(message: string = 'Session expired.', data?: unknown, options?: ErrorOptions) {
    super(419, message, data, options);
  }
}

export class UnprocessableEntityError extends HttpError {
  public constructor(
    message: string = 'Unprocessable entity.',
    data?: unknown,
    options?: ErrorOptions,
  ) {
    super(422, message, data, options);
  }
}

export class InternalServerError extends HttpError {
  public constructor(
    message: string = 'Internal server error.',
    data?: unknown,
    options?: ErrorOptions,
  ) {
    super(500, message, data, options);
  }
}
