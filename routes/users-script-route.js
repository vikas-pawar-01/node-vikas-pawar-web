const express = require('express');

const router = express.Router();

const usersScript = require('../scripts/users-script');

router.get('/', usersScript.scheduleScript);

module.exports = router;