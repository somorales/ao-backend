const router = require("express").Router();

const Product = require("../models/Product.model");
const Kit = require("../models/Kit.model");
const Payment = require("../models/Payment.model");
const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

module.exports = router;
