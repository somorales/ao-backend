const express = require("express");
const router = express.Router();
const Kit = require("../models/Kit.model");
const {verifyToken, verifyAdmin} = require("../middlewares/auth.middlewares")


//   post crear un kit 

router.post("/",verifyToken, verifyAdmin, async (req, res, next) => {
    try {
      const response = await Kit.create({
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        price: req.body.price,
        quantity: req.body.quantity,
        products: req.body.products
      });
  
      res.status(201).json(response);
  
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  
  //   get  leer kit
  
  router.get("/", async (req, res,next) => {
      try {
        const allKit = await Kit.find();
    
        res.status(200).json(allKit);
      } catch (error) {
        console.log(error);
        next(error);
      }
    });
  
  
  //   put editar un kit
  router.put("/:id",verifyToken, verifyAdmin, async (req, res,next) => {
      try {
        const updateKit = await Kit.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
        });
    
        res.status(200).json(updateKit);
      } catch (error) {
        console.log(error);
        next(error);
      }
    });
  
  //   eliminar un kit
  router.delete("/:id",verifyToken, verifyAdmin, async (req, res, next) => {
      try {
        const response = await Kit.findByIdAndDelete(req.params.id);
    
        res.status(204).send();
      } catch (error) {
        console.log(error);
        next (error);
      }
    });
  
  //   get leer un kit
  
  router.get("/:id", async (req, res,next) => {
      try {
        const kit = await Kit.findById(req.params.id);
        res.status(200).json(kit);
      } catch (error) {
        console.log(error);
        next(error);
      }
    });

 // ver los detalles de los productos que tiene cada kit
 router.get("/:id/details",verifyToken, verifyAdmin,async (req, res,next) => {
    try {
      const kit = await Kit.findById(req.params.id).populate("products");
      res.status(200).json(kit);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });
  
  module.exports = router;

