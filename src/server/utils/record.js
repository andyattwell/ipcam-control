const { spawn } = require('child_process')
const { getFreePort } = require('./general')

function playOnVnc(rtspUrl) {
  const cmd = '"C:\\Program Files\\VideoLAN\\VLC\\vlc.exe" ' + rtspUrl + ' --screen-fps=25 --screen-caching=5000 --sout="#transcode{vcodec=theo,vb=800,scale=1,width=800,height=600,acodec=none}:http{mux=ogg,dst=:8181/desktop}" --no-sout-rtp-sap --no-sout-standard-sap --ttl=1 --sout-keep'
  console.log(cmd)
}

function startRecording(options = {}, callback) {
  if (!options.rtspUrl) { return false }
  if (!options.file) { return false }
  
  console.log('startRecording')
  const opts = {
    recordingTime: 60,
    ...options
  }

  const ffmpegCommand = 'ffmpeg';
  const ffmpegArgs = [
    '-i', opts.rtspUrl,

    "-rtsp_transport", "tcp",
    '-f', 'mpeg1video',
    '-b:v', '800k',
    '-r', '30',
    '-c:v', 'copy',
    '-g:v', '50',
    '-c:a', 'copy',
    '-t', opts.recordingTime,
    '-y',
    opts.file
  ];
  // const ffmpegArgs = [
  //   '-i', rtspUrl,
  //   '-c:v', 'libx264',
  //   '-c:a', 'libopus',
  //   outputFile
  // ];

  const childProcess = spawn(ffmpegCommand, ffmpegArgs);
 
  childProcess.on('spawn', () => {
    console.log('SPAWN')
    callback(childProcess, options.file)
  });
}

async function startStreaming(options = {}) {
  if (!options.rtspUrl) { return false }
  const opts = {
    ...options
  }
  console.log('[SERVER]: startStreaming')
  const videoFormat = 'webm'
  const ffmpegCommand = 'ffmpeg';
  let ffmpegArgs = [
    '-i', opts.rtspUrl,
    '-c:v', 'libvpx',
    '-b:v', '400k',
    '-vf', 'scale=568:320',
    // 1080    1920      
    // 720     1280
    // 540     960
    // 450     800
    // 320     568
    // x * 1920 / 1080

    // '-g:v', '25',
    '-listen', 1,
    '-f', videoFormat,
    '-header', '"Access-Control-Allow-Origin: *"', 
  ];


  return new Promise((resolve, reject) => {
    getFreePort()
    .then((port) => {
      console.log('[SERVER]: PORT:', port)
      let exporUri = 'http://' + process.env.VUE_APP_HOST
      exporUri += ':' + port + '/video.' + videoFormat 
      ffmpegArgs.push(exporUri)
      const childProcess = spawn(ffmpegCommand, ffmpegArgs);
      resolve({ childProcess, output: exporUri })
    })
    .catch((error) => {
      console.log('[ERROR]: getFreePort:', error)
      reject(error)
    })
  })
}


module.exports = { startRecording, playOnVnc, startStreaming }