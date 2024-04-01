import { CustomError } from "./error";

const Errors = {
  Fetcher: new CustomError(
    500,
    "swr_fetcher_error",
    "unable to fetch api with swr."
  ),
  Unknown: new CustomError(
    500,
    "unknown_error",
    "unable to describe the error."
  ),
  SQL: new CustomError(
    500,
    "sql_error",
    "unable to exequte statement into database."
  ),
  InvalidHTTPMethod: new CustomError(
    405,
    "invalid_http_method",
    "the http method is not supported by this api."
  ),
};

export default Errors;
