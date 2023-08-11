export const randomString = (len = 8, type) => {
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
  if (type && type === "string") {
    t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz";
  }
  const strLen = t.length;
  let n = "";
  for (let i = 0; i < len; i++) {
    n += t.charAt(Math.floor(Math.random() * strLen));
  }
  return n
}

export default {
  randomString,
}
