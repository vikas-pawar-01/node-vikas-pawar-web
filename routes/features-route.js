const express = require('express');

const router = express.Router();

const featuresController = require('../controllers/features-controller');

router.get('/test', featuresController.test);

router.get('/sendemail', featuresController.sendEmail);

router.get('/sendqueue', featuresController.sendQueueMessage);

router.get('/webclick', featuresController.webClick);

router.get('/sender', featuresController.sender);

router.get('/consumer', featuresController.consumer);

router.get('/script', featuresController.script);

module.exports = router;