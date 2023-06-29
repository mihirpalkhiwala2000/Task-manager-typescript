const successMsgs = {
  success: "Successful",
  successfulLogout: "You have successfully Logged out",
  created: "Created successfully",
  login: "Logged in successfully",
};

const errorMsgs = {
  badRequest: "Invalid request. Please try again!",
  serverError: "There is an internal server error.",
  unauthorized: "Access denied, please login first",
  notFound: "Nothing relevant found. Please try again.",
  emailError: "Email is invalid",
  passError: "Password is invalid",
  ageError: "Age must be positive",
};
const statusCodes = {
  successC: 200,
  createdC: 201,
  badRequestC: 400,
  unauthorizedC: 401,
  notFoundC: 404,
  serverErrorC: 500,
};
export default {
  successMsgs,
  errorMsgs,
  statusCodes,
};
