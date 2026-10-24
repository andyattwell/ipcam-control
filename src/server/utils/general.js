// const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process')
// const http = require('http')
const net = require('net')

// function generateAvailableWebSocketPort(callback) {
//   const startPort = 3000;
//   const endPort = 4000;

//   const checkPort = (port) => {
//     return new Promise((resolve) => {
//       const server = new WebSocket.Server({ port }, () => {
//         server.close();
//         resolve(false);
//       });

//       server.on('error', () => {
//         resolve(true);
//       });
//     });
//   };

//   const findAvailablePort = async () => {
//     for (let port = startPort; port <= endPort; port++) {
//       const inUse = await checkPort(port);
//       if (!inUse) {
//         return port;
//       }
//     }
//     return null;
//   };

//   findAvailablePort()
//     .then((port) => {
//       if (port) {
//         callback(null, port);
//       } else {
//         callback(new Error('No available WebSocket port found.'));
//       }
//     })
//     .catch((error) => {
//       callback(error);
//     });
// }

async function getFreePort() {
  return new Promise( res => {
      const srv = net.createServer();
      srv.listen(0, () => {
          const port = srv.address().port
          srv.close((err) => res(port))
      });
  })
}

// function generateAvailableHttpPort(callback) {
//   const startPort = 3100;
//   const endPort = 4000;

//   const checkPort = (port) => {
//     return new Promise((resolve) => {
//       const server = http.createServer();

//       server.listen(port, 'localhost', () => {
//         server.close();
//         resolve(false);
//       });

//       server.on('error', () => {
//         resolve(true);
//       });
//     });
//   };

//   const findAvailablePort = async () => {
//     for (let port = startPort; port <= endPort; port++) {
//       const inUse = await checkPort(port);
//       if (!inUse) {
//         return port;
//       }
//     }
//     return null;
//   };

//   findAvailablePort()
//     .then((port) => {
//       if (port) {
//         callback(null, port);
//       } else {
//         callback(new Error('No available HTTP port found.'));
//       }
//     })
//     .catch((error) => {
//       callback(error);
//     });
// }

// async function getFreePort() {
//   return new Promise((resolve, reject) => {
//     generateAvailableHttpPort((error, port) => {
//       if (error) {
//         console.error('Error generating available WebSocket port:', error);
//         reject(error)
//       } else {
//         console.log('Generated WebSocket port:', port);
//         resolve(port)
//       }
//     });
//   })
// }

const waitForFile = async function (filePath, retryCount = 5) {
  
  return new Promise ((resolve, reject) => {

    if (retryCount <= 0) {
      reject({ error: 'Not found' })
    }
  
    let timer
  
    // console.log('--- Try ' + retryCount + '. File: ' + filePath)
      
    if (fs.existsSync(filePath)) {
      console.log('File exists')
      clearTimeout(timer)
      resolve(filePath)
    } else {
      timer = setTimeout(() => {
        waitForFile(filePath, retryCount - 1)
          .then((path) => {
            resolve(path)
          })
          .catch((error) => {
            reject(error)
          })
          .finally(() => {
            clearTimeout(timer)
          })
      }, 1000)
    }
  })
}

function deleteFileIfExists(filePath) {
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting file:', unlinkErr);
          return false
        } else {
          // console.log('File deleted successfully:', filePath);
          return true
        }
      });
    } else {
      console.error('Error accessing file:', err);
      return false
    }
  });
}


function deleteFilesInDir(directory) {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      deleteFileIfExists(filePath)
    });
  });
}

// function isProcessRunning(pid, callback) {
//     const command = process.platform === 'win32' ? `tasklist` : `ps -p ${pid}`;

//     exec(command, (error, stdout) => {
//       if (error) {
//         return callback(error, null);
//       }

//       let found = false
//       if (process.platform === 'win32') {
//         // console.log(`[SERVER] stdout:`, stdout)
//         // For Windows, check if the process name exists in the output
//         found = stdout.toLowerCase().includes(`pid: ${pid}`)
//       } else {
//         // For Unix-like systems, check if the output contains the given PID
//         found = stdout.includes(pid.toString())
//       }
//       console.log(`[SERVER] isProcessRunning: ${pid}`, found)

//       return callback(null, found)
//     });
// }

function isProcessRunning(pid, processName) {
  return new Promise((resolve, reject) => {
    const command =
      process.platform === 'win32'
        ? `tasklist /FI "PID eq ${pid}" /FO CSV /NH`
        : `ps -p ${pid} -o comm=`;

    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
        return;
      }

      if (process.platform === 'win32') {
        // For Windows, check if the process name exists in the output
        const processes = stdout.trim().split('\n');
        const processNames = processes.map((process) => {
          const [, name] = process.split(',');
          return name ? name.replace(/"/g, '').toLowerCase() : 'false';
        });
        resolve(processNames.includes(processName.toLowerCase()));
      } else {
        // For Unix-like systems, check if the output contains the given PID and process name
        resolve(stdout.trim() === processName);
      }
    });
  });
}

function getFfmpegProcessesCount() {
  const command = process.platform === 'win32' ? `tasklist` : `ps -n ffmpeg`;
  return new Promise((resolve, reject) => {
    
    exec(command, (error, stdout) => {
      if (error) {
        console.log('Error getFfmpegProcessesCount', error)
        reject(error)
        return
      }

      const regex = new RegExp(`ffmpeg`, 'gi');
      let matches = []

      if (process.platform === 'win32') {
        matches = stdout.toLowerCase().match(regex)
      } else {
        matches = stdout.match(regex)
      }

      resolve(matches ? matches.length : 0)
    });
  })
}

// Kills a PID and all child process
function killProcessByPid (pid, callback) {
  // console.log('[SERVER]: killProcessByPid', pid)
  if (!pid) {
    console.log('[SERVER]: killProcessByPid No pid provided', pid)
    return callback && callback('No pid provided')
  }
  
  isProcessRunning(pid, 'ffmpeg')
    .then((found) => {
      
      if (found) {
        console.log('[SERVER]: killProcessByPid', process.pid)
        exec(`taskkill /pid ${pid} /t /f`, (err, stdout, stderr) => {
          if (err || stderr) {
            console.log('[SERVER]: Error killing process')
            console.log({err})
            return callback && callback(err || stderr)
          }
          return callback && callback(false, stdout)
        })
      } else {
        // console.log('[SERVER]: Process not found', process.pid)
        return callback && callback('Process' + process.pid + ' not found')
      }

    })
    .catch((error) => {
      console.log('[SERVER] Error looking for proccess', error)
      return callback && callback(error)
    })

}

function killFfmpeg () {
  console.log('[SERVER] Killing Ffmpeg')
  let appName = 'ffmpeg.exe'
  // Kills a process based on filename of the exe and all child processes
  exec(`taskkill /im ${appName} /t /f`, (err, stdout, stderr) => {
    if (err || stderr) {
      console.log('[SERVER]: killFfmpeg')
      // console.log(err)
      return err || stderr
    }
    return stdout
    // console.log('stdout', stdout)
    // console.log('stderr', err)
  })
}

function createDirectoryIfNotExists(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
    return true
  }
}

async function listFilesInPath(dirPath) {
  return new Promise((resolve, reject) => {  
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        reject('Error reading directory:', err);
      }

      if (!files) {
        return resolve([]);
      }
      let filesArr = []
      files.forEach((file, i) => {
        const filePath = path.join(dirPath, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error('Error retrieving file stats:', err);
            return;
          }
          if (stats.isFile()) {
            const filePathArr = filePath.split('\\');
            let fileName = filePathArr[filePathArr.length - 1]
            filesArr.push(fileName);
          }
          if (i === files.length - 1) {
            resolve(filesArr)
          }
          // else if (stats.isDirectory()) {
          //   listFilesInPath(filePath);
          // }
        });
      });
    });
  })
  
}

const getUniqueID = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return s4() + s4() + '-' + s4();
};

function isDev() {
  return process.mainModule.filename.indexOf('app.asar') === -1;
}

// Example usage:
module.exports = {
  getFreePort, 
  deleteFileIfExists, 
  waitForFile, 
  deleteFilesInDir, 
  isProcessRunning,
  killFfmpeg,
  killProcessByPid,
  getFfmpegProcessesCount,
  createDirectoryIfNotExists,
  listFilesInPath,
  getUniqueID,
  isDev
}