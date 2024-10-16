const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { verifyToken } = require("../middlewares/auth.middlewares");

// POST "/api/auth/signup"
router.post("/signup", async (req, res, next) => {
  console.log(req.body);
  const { email, password, name } = req.body;

  // 1. Los campos son obligatorios
  if (!email || !password || !name) {
    res.status(400).json({ message: "Todos los campos son requeridos" });
    return; // esto detiene la funcion. Actuando como clausula de guardia.
  }

  // 2. la contraseña deberia ser lo suficientemente fuerte
  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/gm;
  if (!regexPassword.test(password)) {
    res.status(400).json({
      message:
        "La contraseña debe tener al menos, una mayuscula, una minuscula, un numero y entre 8 y 16 caracteres",
    });
    return;
  }

  try {
    const foundUser = await User.findOne({ email: email });
    if (foundUser) {
      res.status(400).json({ message: "Usuario ya registrado con ese email" });
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: hashPassword,
      name,
    });

    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

// POST "/api/auth/login"
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);

  if (!email || !password) {
    res.status(400).json({ message: "Todos los campos son requeridos" });
    return;
  }

  try {
    const foundUser = await User.findOne({ email: email });
    console.log(foundUser);
    if (!foundUser) {
      res.status(400).json({ message: "Usuario no encontrado con ese email" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );
    if (!isPasswordCorrect) {
      res.status(400).json({ message: "Contraseña no es correcta" });
      return;
    }

    const payload = {
      _id: foundUser._id,
      email: foundUser.email,
      role: foundUser.role,
    };
    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d",
    });

    res.status(200).json({ authToken: authToken });
  } catch (error) {
    next(error);
  }
});

// GET "/api/auth/verify"
router.get("/verify", verifyToken, (req, res) => {
  res.status(200).json(req.payload);
});

// ejemplo de una llamada privada como /user/mi-perfil
router.get("/user/basket", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id)
      .populate("basket.kits")
      .populate("basket.products");
    res.status(200).json(user.basket);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/user/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id);

    const publicProfile = {
      name: user.name,
      email: user.email,
    };

    res.status(200).json(publicProfile);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
