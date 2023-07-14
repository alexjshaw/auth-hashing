const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const { Prisma } = require("@prisma/client");
// const { json } = require('express')
// const { User } = require("@prisma/client");

router.post('/', async (req, res) => {

  const { username, password } = req.body
    const salt = 10
    
    bcrypt.hash(password, salt, async (e, hash) => {
      try {
        const newUser = await prisma.user.create({
          data: {
            username: username,
            password: hash,
          },
        });
        delete newUser.password
        res.status(201).json({ user: newUser })
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            return res.status(409).json({ error: `User with username '${username}' already exists` })
          }
        }
        res.status(500).json({ error: e.message })
      }
    })
});

module.exports = router;