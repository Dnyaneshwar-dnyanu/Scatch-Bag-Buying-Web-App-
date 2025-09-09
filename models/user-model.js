const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
     fullname: {
          type: String,
          minLength: 3,
          trim: true,
     },
     country: {
          type: String,
          default: ""
     },
     phoneNumber: {
          type: Number,
     },
     houseNo: {
          type: String,
          default: ""
     },
     village: {
          type: String,
          default: ""
     },
     landmark: {
          type: String,
          default: ""
     },
     pincode: Number,
     city: {
          type: String,
          default: ""
     },
     state: {
          type: String,
          default: ""
     },
     email: String,
     password: String,
     cart: [{
          product: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'product',
          },
          count:  {
               type: Number,
               default: 1,
               min: 1,
          }
     }],
     orders: [{
          product: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'product',
          },
          count:  {
               type: Number,
               default: 1,
               min: 1,
          }
     }],
     contact: Number,
     picture: Buffer
});

module.exports = mongoose.model('user', userSchema);