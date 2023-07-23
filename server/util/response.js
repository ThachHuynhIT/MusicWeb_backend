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

const responseSuccessList = (data, message) => {
  return {
    isSuccess: true,
    data: data,
    message: message,
  };
};

module.exports = {
  responseError,
  responseSuccessDetails,
  responseSuccessList,
};
