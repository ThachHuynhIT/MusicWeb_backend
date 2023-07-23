const responseError = (message, code) => {
  return {
    isSuccess: false,
    item: null,
    errors: {
      message: message,
      code: code,
    },
  };
};

const responseSuccessDetails = (item, message) => {
  return {
    isSuccess: true,
    item: item,
    message: message,
  };
};

module.exports = {
  responseError,
  responseSuccessDetails,
};
