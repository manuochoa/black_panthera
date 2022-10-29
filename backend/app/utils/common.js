const SHA256 = require("crypto-js/sha256");


const generateHashPass = (password) => {
    return JSON.stringify(SHA256(password).words);
};

module.exports = {
    generateHashPass
}