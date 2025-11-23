const cors = require("cors");
const allowedOrgins = process.env.ALLOWED_ORIGINS.split(",");
const corsOption = {
  orgin: function (orgin, callback) {
    if (!orgin) {
      return callback(null, true); // null means pass without giving error
    }
    if (allowedOrgins.includes(orgin)) {
      return callback(null, true);
    } else return callback(new Error("cors policy, origin not allowed"));
  },
  credentials:true,
  methods:['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders:['Content-Type', 'Authorization']
};

module.exports= (corsOption);
