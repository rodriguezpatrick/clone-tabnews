import {
  MethodNotAllowedError,
  InternalServerError,
  ValidationError,
  NotFoundError,
} from "infra/errors";

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}
function onNoErrorHandler(error, request, response) {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    statusCode: error.statusCode,
    cause: error,
  });

  console.error(publicErrorObject);
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

const controller = {
  errorsHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onNoErrorHandler,
  },
};

export default controller;
