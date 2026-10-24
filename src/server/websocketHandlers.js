const Camera = require('./entities/Camera')
const { startStreaming } = require('./utils/record')


const handleConnection = async (ws, req) => {
  console.log('[SERVER]: New Connection! ')

  let cameraId = req.url.split('/?id=')[1]
  if (!cameraId) { return false }
  
  const camera = await Camera.find(cameraId)
  if (!camera || !camera.onvifData || !camera.onvifData.streamUrl) { return false }
  let stream
  try { 
    stream = await startStreaming({ rtspUrl: camera.onvifData.streamUrl })
    stream.childProcess.on('error', (code, arg2) => {
      console.log('[ERROR] STREAM', {code, arg2})
    })
    stream.childProcess.on('data', function(data) {
      console.log('stdout: ' +data);
    });
   
    stream.childProcess.on('exit', (code, signal) => {
      console.log('[EXIT] STREAM', {code, signal})
    });

    ws.send(JSON.stringify({ videoUri: stream.output }))
  } catch (error) {
    console.log('[ERROR] STREAM', error)
  }

  ws.on('close', () => {
    console.log('[SERVER] videoStream close')
    stream.childProcess.kill('SIGINT');
  });
}

// const handleMessage = async (message) => {}

// const handleClose = async (ws) => {}

module.exports = {
  handleConnection
}