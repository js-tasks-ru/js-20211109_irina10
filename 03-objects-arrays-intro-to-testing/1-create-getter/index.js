/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const pathArr = path.split('.');

  let result = (obj) => {
    let property;

    for (let value of pathArr) {
      if (!(value in obj)) {
        return;
      }
      property = obj[value];
      obj = property;
    }

    return property;
  };

  return result;
}
