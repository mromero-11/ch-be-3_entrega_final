export const errorDictionary = {
  USER_REGISTRATION_FAILED: { status: 400, message: 'Error al registrar usuario' },
  PET_CREATION_FAILED:      { status: 400, message: 'Error al crear mascota' },
  INVALID_MOCK_PARAMETERS:  { status: 400, message: 'Parámetros inválidos para mock' },
  DATA_GENERATION_FAILED:   { status: 500, message: 'Error al generar datos en BD' }
};

export class CustomError extends Error {
  constructor({ name, message, cause, status }) {
    super(message);
    this.name = name;
    this.cause = cause;
    this.status = status || 500;
  }
}

export class ValidationError extends CustomError {
  constructor(message, cause) {
    super({ name: 'ValidationError', message, cause, status: 400 });
  }
}

export class NotFoundError extends CustomError {
  constructor(message, cause) {
    super({ name: 'NotFoundError', message, cause, status: 404 });
  }
}

export class DatabaseError extends CustomError {
  constructor(message, cause) {
    super({ name: 'DatabaseError', message, cause, status: 500 });
  }
}
