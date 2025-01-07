export class ApplicationError extends Error {
  statusCode: number;
  messageCode?: string;
  payload?: any;

  constructor(opts: {
    statusCode?: number;
    messageCode?: string;
    message: string;
    payload?: any;
  }) {
    const { message, messageCode, statusCode = 400, payload } = opts;
    super(message);

    this.statusCode = statusCode;
    this.messageCode = messageCode;
    this.payload = payload;
  }
}

export const getError = (opts: {
  statusCode?: number;
  messageCode?: string;
  message: string;
  payload?: any;
}) => {
  const error = new ApplicationError(opts);
  return error;
};
