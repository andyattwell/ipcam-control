
// const { getFfmpegProcessesCount } = require('./utils/general')

// async function startCameraRecording (connection) {

//   if (!connection || !connection.camera) {
//     console.log("[SERVER]: startCameraRecording No camera configured for connection")
//     return false
//   }
//   console.log('[SERVER] Start recording', connection.camera.id)

//   const cameraID = connection.camera.id

//   const process = processList.find((p) => p.camera.id === cameraID)

//   if (process) {
//     console.log('[SERVER] Process for camera ' + cameraID +  ' already running ', process.process.pid)
//     return
//   }

//   const streamUrl = connection.camera.streamUrl
  
//   let file = '/' + cameraID.toString() + '/' + Date.now().toString().substring(0, 9) + '.' + videoExtention
//   let filePath = path.join(videoDirPath)
  
//   createDirectoryIfNotExists(filePath)

//   startRecording({rtspUrl: streamUrl, file: path.join(filePath, file)}, (childProcess, outputFile) => {

//     const childPID = childProcess.pid

//     processList.push({
//       process: childProcess,
//       camera: connection.camera,
//       filePath: outputFile
//     })
  
//     // waitForFile(filePath).then(() => {
//     //   sendFileStats(filePath, { next: filePath })
//     // }).catch((error) => {})
    
//     // sendFileStats(outputFile, { next: outputFile })
//     // console.log('[SERVER] New process for camera:' + cameraID, childPID)


//     childProcess.on('data', function(data) {
//       sendStream(data)
//     });

//     childProcess.on('close', (code) => {
//       if (code === 0) {
//         console.log('[FFmpeg] process completed successfully');
//         sendFileStats(outputFile, {close: true, code})
//         let timer = setTimeout(() =>{
//           deleteFileIfExists(outputFile)
//           clearTimeout(timer)
//         }, 30000)
//       } else {
//         console.error('[FFmpeg] process failed with code:', code);
//       }

//       processList = processList.filter((proc) => proc.process.pid !== childPID)

//     });

//   })


// }

// function checkStreams(timeOut = 2) {

//   setTimeout(async () => {

//     console.log('===========================')
//     console.log('[SERVER] connections: ', wss.clients.size)
//     const ffmpegCount = await getFfmpegProcessesCount()
//     console.log('[SERVER] ffmpegCount: ', ffmpegCount)
//     console.log('===========================')
    
//     checkStreams()

//   }, timeOut * 1000)
// }

// checkStreams()