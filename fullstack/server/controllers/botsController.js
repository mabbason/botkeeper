const botsDB = {
  bots: require('../model/bots.json'),
  setBots: function (data) { this.bots = data }
}
const fsPromises = require('fs').promises;
const path = require('path');


const getAllBots = async (req, res) => {
  res.json(botsDB.bots);
}

const createNewBot = async (req, res) => {
  if(!req?.body?.name) {
    return res.status(400).json({ 'message': 'Bot name is required.'})
  }
  try {
    const newBot = {
      id: botsDB.bots?.length ? botsDB.bots[botsDB.bots.length - 1].id + 1 : 1,
      name: req.body.name,
    }

    botsDB.setBots([...botsDB.bots, newBot]);
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'model', 'bots.json'),
      JSON.stringify(botsDB.bots)
    );
    res.status(201).json(botsDB.bots);
  } catch(err) {
    console.error(err)
  }
}

const deleteBot = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({ "message": 'ID parameter is required.' });
  }
  const deleteId = parseInt(req.body.id);
  const bot = botsDB.bots.find(b => b.id === deleteId);

  if (!bot) {
    return res.status(404).json({ "message": 'No bot with that ID is found.' });
  } else if (bot.name !== req.body.name) {
    return res.status(400).json({ "message": 'Incongruent bot information.' });
  }

  const botsDBWithoutBot = botsDB.bots.filter(b => b.id !== deleteId);
  botsDB.setBots([...botsDBWithoutBot]);
  await fsPromises.writeFile(
    path.join(__dirname, '..', 'model', 'bots.json'),
    JSON.stringify(botsDB.bots)
  );
  res.json(botsDB.bots);
}

module.exports = {
  getAllBots,
  createNewBot,
  deleteBot
}