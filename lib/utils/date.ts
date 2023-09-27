function getMilliseconds(seconds: number) {
  return seconds * 1000;
}

/**
 * Takes in number of seconds and adds it to the current date (in milliseconds)
 * and returns a new date object
 *
 * @param {number} seconds - number of seconds
 */
function calcExpiresOn(seconds: number) {
  return new Date(new Date().getTime() + getMilliseconds(seconds));
}

export {
  calcExpiresOn,
};
