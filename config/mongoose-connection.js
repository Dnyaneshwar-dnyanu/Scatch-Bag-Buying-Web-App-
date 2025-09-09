const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');
const config = require('config')

mongoose
     .connect(`${config.get("MONGODB_URL")}/scatch`)
     .then(function() {
          dbgr("Connected to mongoose");
     })
     .catch(function (err) {
          dbgr(err);
     });
 

module.exports = mongoose.connection;