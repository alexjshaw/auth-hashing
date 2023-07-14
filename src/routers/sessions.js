const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Prisma } = require("@prisma/client");
// const { json } = require('express')
// const { User } = require("@prisma/client");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        password: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = { username };
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({ error: 'JWT Secret is not defined' })
    }

    const token = jwt.sign(payload, secret);
    return res.status(200).json({ token });
  
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

module.exports = router;
