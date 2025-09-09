const express = require('express');
const router = express.Router();
const userModel = require('../models/user-model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { BaseCollection } = require('mongoose');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const isLoggedIn = require('../middlewares/isLoggedIn');
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.use(cookieParser());

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/logout', logoutUser);

router.get('/addToCart/:productId', isLoggedIn, async (req, res) => {
     let user = await userModel.findOne({email: req.user.email});
     let index = user.cart.findIndex(
          item => item.product.toString() === req.params.productId
     );

     if (index == -1) {
          user.cart.push({
               product: req.params.productId, 
               count: 1
          });
          await user.save();
     
          req.flash('success', 'added to cart, you can view in cart')
     }
     else {
          user.cart.splice(index, 1);
          await user.save();
          req.flash('success', 'removed from cart, you can view in cart');
     }
     res.redirect('/index/shop');
});

router.get('/cart', isLoggedIn, async (req, res) => {
     let user = await userModel.findOne({email: req.user.email}).populate('cart.product');
     let totalBill = 0;
     user.cart.forEach(item => {
          totalBill += (item.product.price + 20 - item.product.discount) * item.count;
     });

     res.render('cart', {items: user.cart, totalBill: totalBill, userView: true, isLoggedIn: false});
});

router.get('/incCount/:productId', isLoggedIn, async (req, res) => {
     let user = await userModel.findOne({email: req.user.email});

     let item = user.cart.find(
          item => item.product.toString() === req.params.productId
     );

     console.log(item);
     item.count += 1;
     await user.save();

     res.redirect('/users/cart');
});

router.get('/decCount/:productId', isLoggedIn, async (req, res) => {
     let user = await userModel.findOne({email: req.user.email});

     let item = user.cart.find(
          item => item.product.toString() === req.params.productId
     );

     console.log(item);
     item.count -= 1;
     if (item.count == 0) {
          let index = user.cart.indexOf(item);
          user.cart.splice(index, 1);
     }
     await user.save();

     res.redirect('/users/cart');
});

router.get('/profile', isLoggedIn, async (req, res) => {
     console.log(req.user.picture);
     let status = req.flash('status')
     res.render('profile', {user: req.user, userView: true, isLoggedIn: false, status});
});

router.post('/updatePicture', isLoggedIn, upload.single('picture'), async (req, res) => {
     let user = req.user;
     
     user.picture = req.file.buffer;
     await user.save();

     console.log(req.file.buffer);
     res.redirect('/users/profile');
});

router.post('/updateProfile', isLoggedIn, async (req, res) => {
     let { fullname, email, newPassword, confPassword } = req.body;
     let user = req.user;

     if (confPassword.length > 0 || newPassword.length > 0) {
          if (confPassword === newPassword ) {
               bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(confPassword, salt, async (err, hash) => {
                         await userModel.findOneAndUpdate({_id: user._id}, {fullname, email, password: hash});
                         req.flash('status', 'Profile details updated...');
                    });
               });
          }
          else {
               req.flash('status', "New password and confirm password should be same");
          }
     } else {
          await userModel.findOneAndUpdate({_id: user._id}, {fullname, email});
     }

     res.redirect('/users/profile');
});

router.get('/order', isLoggedIn, async (req, res) => {
     let user = await userModel.findOne({email: req.user.email}).populate('orders.product');
     let totalBill = 0;
     user.cart.forEach(item => {
          totalBill += (item.product.price + 20 - item.product.discount) * item.count;
     });

     res.render('order', {items: user.orders, totalBill: totalBill, userView: true, isLoggedIn: false});
});

router.get('/orderForm/:productid', isLoggedIn, async (req, res) => {
     let user = req.user;
     let products = [];
     products.push(await productModel.findOne({_id: req.params.productid}));

     res.render('orderForm', {user, products, userView: true, isLoggedIn: false});
});

router.get('/orderAll', isLoggedIn, async (req, res) => {
     let user = req.user;
     
     let products = [];

     for(const item of user.cart) {
          products.push(await productModel.findOne({_id: item.product}));
     }

     res.render('orderForm', {user, products, userView: true, isLoggedIn: false});
});

router.post('/placeOrder/:productid', isLoggedIn, async (req, res) => {
     let user = req.user;

     let item = user.cart.find(
          item => item.product.toString() === req.params.productid
     );

     user.orders.push({
          product: item.product,
          count: item.count
     });

     let index = user.cart.indexOf(item);
     user.cart.splice(index, 1);

     let { country, phoneNumber, houseNo, village, landmark, pincode, city, state} = req.body;

     await userModel.findOneAndUpdate({_id: user._id}, {
          country,
          phoneNumber,
          houseNo,
          village,
          landmark,
          pincode,
          city,
          state
     });

     await user.save();
     res.redirect('/users/order');
});

router.post('/placeorderall', isLoggedIn, async (req, res) => {
     let user = req.user;
     user.orders = user.cart;
     
     let { country, phoneNumber, houseNo, village, landmark, pincode, city, state} = req.body;
     
     await userModel.findOneAndUpdate({_id: user._id}, {
          country,
          phoneNumber,
          houseNo,
          village,
          landmark,
          pincode,
          city,
          state
     });

     user.cart.splice(0, user.cart.length);
     await user.save();

     res.redirect('/users/order');

})

module.exports = router;