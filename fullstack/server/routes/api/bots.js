const express = require('express');
const botsController = require('../../controllers/botsController');
const router = express.Router();

router.route('/')
  .get(botsController.getAllBots)
  .post(botsController.createNewBot)
  .delete(botsController.deleteBot)

module.exports = router;