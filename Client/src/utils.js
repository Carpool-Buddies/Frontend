export const arrayToUrlString = (arr) => arr.map(i => encodeURIComponent(i)).join(";");
