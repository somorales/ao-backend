const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model");
const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares");

//   post crear un producto

router.post("/", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const response = await Product.create({
      name: req.body.name,
      category: req.body.category,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      quantity: req.body.quantity,
      size: req.body.size,
      color: req.body.color,
    });

    res.status(201).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//   get  leer productos

router.get("/", async (req, res, next) => {
  try {
    let filtros;

    if (req.query.name === undefined) {
      filtros = {};
    } else {
      filtros = { name: { $regex: req.query.name, $options: "i" } };
    }

    const allProduct = await Product.find(filtros);

    res.status(200).json(allProduct);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//   put editar un producto
router.put("/:id", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updateProduct);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//   get leer un producto

router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
