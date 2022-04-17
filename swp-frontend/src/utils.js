export function getNextItem(array, e) {
  let found = false;
  let any_result = null;
  for (let el of array) {
    if (el === undefined) {
      continue;
    }
    if (any_result === null) {
      any_result = el;
    }
    if (el === e) {
      found = true;
    } else {
      if (found) {
        return el;
      }
    }
  }
  return any_result;
}

export function getRequestErrorMessage(error) {
  const message =
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString();
  return message;
}
