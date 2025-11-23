const NodeCache = require("node-cache");

const stdTTL = 5 * 60; //300 seconds
const checkperiod = 2 * 60; //120
const cache = new NodeCache({ stdTTL, checkperiod });

module.exports = cache;
