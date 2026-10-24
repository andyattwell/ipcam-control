const express = require('express');
const router = express.Router();
const path = require('path');
const Camera = require('../entities/Camera')
const fs = require('fs')

router.get('/app', async (req, res) => {
  var cameras = await Camera.all()
  await cameras.map(async (cam) => {
    cam = await cam.connect();
    cam.onvifData = cam.getOnvifInfo();
    return cam
  })
  // console.log(cameras)
  res.render('pages/index', {
    section: 'dashboard',
    cameras: cameras
  });
});

router.get('/app/camera/:id', async (req, res) => {
  const cameras = await Camera.all();
  const camera = await Camera.find(req.params.id)
  try {
    await camera.connect()
    await camera.getOnvifInfo()
  } catch (error) {
    console.log('Error connecting to camera')
    console.log(error)
  }
  res.render('pages/index', {
    cameras: cameras,
    camera: camera,
    section: 'camera'
  });
});

router.get('/', async (req, res) => {
  fs.readFile(path.join(__dirname, '../../../dist/index.html'), 'utf8', (err, text) => {
    res.send(text);
  });
});

module.exports = router;