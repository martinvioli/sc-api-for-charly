enum AuthException {
  MISSING_AUTH_HEADER = "No auth allowed without 'Authorization' header",
  MISSING_TOKEN = "No auth type token provided",
  INVALID_TOKEN = "Token provided is not valid",
  USER_NOT_FOUND = "Email provided is not registered",
  USER_WRONG_PASSWORD = "Password is incorrect",
}

export default AuthException;
