const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const productModel = require('../models/product-model');

router.get("/", function (req, res) {
     res.send("Hello Bro");
});


router.post('/addProduct', upload.single('image'), async (req, res) => {
     try {
          let { name, price, discount, bgcolor, panelcolor, textcolor} = req.body;
          let image = req.file.buffer;
     
          let createdProduct = await productModel.create({
               image, 
               name, 
               price, 
               discount, 
               bgcolor, 
               panelcolor, 
               textcolor
          });
     
          req.flash('success', 'New Product added successfully!');
          res.redirect('/owners/admin');
     } 
     catch (err) {
          res.send(err.message);
     }
});


module.exports = router;