export class Response {
  static successResponse = (data, message) => {
    return { data, message };
  };

  static errorResponse = (errorMessage) => {
    return { error: { message: errorMessage } };
  };
}
