const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async function (req, res) {
     try {
          let { email, password, fullname } = req.body;

          let user = await userModel.findOne({ email: email });

          if (user) {
               req.flash('error', 'This user already have account in Scatch');
               return res.redirect('/index');
          } 

          bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(password, salt, async (err, hash) => {

                    let createdUser = await userModel.create({
                         fullname,
                         email,
                         password: hash,
                    });

                    let token = generateToken(createdUser);
                    res.cookie('token', token);
                    req.flash('success', 'Your account registered successfully!');

                    console.log(createdUser);
                    res.redirect('/index/shop');
               });
          });

     } catch (err) {
          req.flash('error', err.message);
          res.redirect('/index');
     }
}

module.exports.loginUser = async function (req, res) {

     let { email, password } = req.body;
     let user = await userModel.findOne({ email: email });

     if (!user){
          req.flash('error', 'email or password is incorrect')
          return res.redirect('/index');
     }
     
     bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
               let token = generateToken(user);
               res.cookie('token', token);
               req.flash('success', 'You Logged In your account successfully!');
               res.redirect('/index/shop');
          } else {
               req.flash('error', 'email or password is incorrect')
               res.redirect('/index');
          }
     });
}

module.exports.logoutUser = async function (req, res) {
     res.cookie('token', "");
     res.redirect('/index');
}