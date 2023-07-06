/* export const ErrorNames = {
  MISSING_VALUES: "Bad request",
  UNAUTHORIZED: "Invalid credentials",
  NOT_FOUND: "Error during processing the request",
  SERVER_ERROR: "Process error",
};

export const ErrorMessage = {
  MISSING_VALUES: "The information recived in the body request is incomplete.",
  UNAUTHORIZED: "We have blocked the access to this endpoint.",
  NOT_FOUND:
    "We can't found an item with that id. Please, check the request params.",
  SERVER_ERROR: "An error has occurred when trying to process the request",
};

export const ErrorCause = {
  MISSING_VALUES: "There are some missing values",
  UNAUTHORIZED: "Unauthorized to access",
  NOT_FOUND: "Resource not found",
  SERVER_ERROR: "Internal server error",
};

export const ErrorStatus = {
  MISSING_VALUES: 404,
  UNAUTHORIZED: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}; */

export const ErrorEnums = {
  MISSING_VALUES: {
    name: "Bad request",
    message: "The information recived in the body request is incomplete.",
    cause: "404-There are some missing values",
  },
  UNAUTHORIZED: {
    name: "Invalid credentials",
    message: "We have blocked the access to this endpoint",
    cause: "403-Unauthorized to access",
  },
  NOT_FOUND: {
    name: "Error during processing the request",
    message:
      "We can't found an item with that id. Please, check the request params",
    cause: "404-Resource not found",
  },
  SERVER_ERROR: {
    name: "Process error",
    message: "An error has occurred when trying to process the request",
    cause: "500-Internal server error",
  },
};
