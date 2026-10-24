const express = require('express');
const router = express.Router();
const ConfigController = require('../controllers/ConfigController')

router.get('/api/config', async (req, res) => {
  try {
    ConfigController.getAll(req.body)
      .then((cameras) => {
        res.send({cameras})
      })
  } catch (error) {
    res.status(500).send(error)
  }
});

module.exports = router;