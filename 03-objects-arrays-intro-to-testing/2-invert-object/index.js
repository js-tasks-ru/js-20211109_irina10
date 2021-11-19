/**
 * invertObj - should swap object keys and values
 * @param {object} obj - the initial object
 * @returns {object | undefined} - returns new object or undefined if nothing did't pass
 */
export function invertObj(obj) {
  if (typeof obj === 'undefined') {
    return;
  }

  const newObj = {};

  for (let item of Object.entries(obj)) {
    let [value, key] = item;
    newObj[key] = value;
  }

  return newObj;
}
