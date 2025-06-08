
export const sendResponse = (res, statusCode, message, success, data = null) => {
    return res.status(statusCode).json({
      message,
      success,
      result: data,
    });
  };
  