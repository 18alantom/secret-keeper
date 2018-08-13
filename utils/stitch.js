const lorem = require("./lorem");

const stitch = secrets => {
  let splitLorem = lorem.split(" ");
  const concatConst = Math.floor(secrets.length / splitLorem);
  // add more lorem ipsum as filler if too many secrets.
  if (concatConst) {
    let newLorem = [];
    for (let x = 0; x <= concatConst; x++) {
      newLorem = newLorem.concat(splitLorem);
    }
    splitLorem = newLorem.slice();
  }

  secrets.forEach(secretObject => {
    const random = Math.floor(Math.random() * splitLorem.length);
    const secret = `<span class="message"> ${secretObject.age} ${secretObject.secret} </span>`;
    splitLorem.splice(random, 0, secret);
  });
  return splitLorem.join(" ");
};

module.exports = stitch;
