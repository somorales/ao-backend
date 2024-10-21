const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { verifyToken } = require("../middlewares/auth.middlewares");

// body del frontend
// {productId: ...}
// {kitId: ...}

router.post("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);

    if(req.body.productId){
      user.favorites.products.push(req.body.productId);
    }else if(req.body.kitId){
      user.favorites.kits.push(req.body.kitId);
    }

    const updateUser = await User.findByIdAndUpdate(req.payload._id, user, {
      new: true,
    });

    res.status(200).json(updateUser.favorites);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
