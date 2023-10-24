export const buildErrorResponse = (statusCode: number, message: string) => {
  return {
    statusCode,
    body: JSON.stringify({ error: message }),
  };
};

export const buildBadRequestResponse = (message: string = "Bad Request") => {
  return buildErrorResponse(400, message);
};

export const buildInternalServerErrorResponse = (
  message: string = "Internal Server Error"
) => {
  return buildErrorResponse(500, message);
};
