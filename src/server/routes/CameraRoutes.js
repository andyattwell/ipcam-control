const express = require('express');
const router = express.Router();
const request = require('request');
const CameraController = require('../controllers/CameraController')

router.get('/api/cameras', async (req, res) => {

  try {
    const cameras = await CameraController.getCameras()
    res.json(cameras);
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.post('/api/camera', async (req, res) => {
  try {
    const camera = await CameraController.createCamera(req.body)
    res.send(camera)
  } catch (error) {
    res.status(500).send(error)
  }
});

router.get('/api/camera/:id', async (req, res) => {
  
  if (!req.params.id) {
    return res.status(404).send('Not found')
  }

  try {
    const camera = await CameraController.getCamera(req.params.id, req.query.reload)
    await camera.connect()
    await camera.getOnvifInfo()
    res.json(camera);
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.post('/api/camera/:id', async (req, res) => {
  
  if (!req.params.id) {
    return res.status(404).send('Not found')
  }

  try {
    const camera = await CameraController.updateCamera(req.params.id, req.body)
    res.json(camera);
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.delete('/api/camera/:id', async (req, res) => {
  try {
    const result = CameraController.deleteCamera(req.params.id)
    res.json(result);
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.get('/api/camera/:id/recordings', async (req, res) => {
  try {
    const recordings = CameraController.getRecordings(req.params.id)
    res.json(recordings);
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.post('/api/camera/:id/osd', async (req, res) => {
  try {
    const result = await CameraController.saveOSD(req.params.id, req.body)
    res.json(result);
  } catch (error) {
    return res.status(500).send(error)
  }
});
router.get('/api/image', async (req, res) => {
  let uri = req.query.uri 
      + '&channel='+ req.query.channel
      + '&user='+ req.query.user
      + '&password='+ req.query.password
  
    request.get(uri)
      .on('response', function() {})
      .on('error', function(error) {
        res.status(500).send(error)
      }).pipe(res);
});

router.post('/api/camera/:id/move', async (req, res) => {
  try {
    const move = CameraController.moveCamera(req.params.id, req.body.dir, req.body.step)
    res.json(move);
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.post('/api/camera/:id/stop', async (req, res) => {
  try {
    const stop = CameraController.stopMoveCamera(req.params.id)
    res.json(stop);
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.get('/api/discover', async (req, res) => {
  try {
    const discover = await CameraController.discover()
    res.json(discover);
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.post('/api/testConnection', async (req, res) => {
  try {
    const test = await CameraController.testConnection(req.body.device)
    res.json(test);
  } catch (error) {
    return res.status(500).send(error)
  }
});

router.get('/video/:camera/:file', async (req, res) => {
  try {
    const video = CameraController.getVideoFile(req.params.id, req.params.file)
    res.setHeader('Content-Type', 'video/x-matroska');
    res.sendFile(video);
  } catch (error) {
    return res.status(500).send(error)
  }
})

router.get('/testvideo', async (req, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test video</title>
  </head>
  <body>
    <video src="http://localhost:3000/liveFeed/1" controls autoplay width="100%"></video>
  </body>
  </html>
  `)
})

module.exports = router;