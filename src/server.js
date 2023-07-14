const express = require("express");
const cors = require("cors");
const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const registrationsRouter = require('./routers/registrations');
app.use('/register', registrationsRouter);
const sessionsRouter = require('./routers/sessions')
app.use('/login', sessionsRouter)

module.exports = app;