const express = require('express');
const authRouter = require('./routes/auth');

const router = express.Router();

router.use(authRouter);

module.exports = router;
