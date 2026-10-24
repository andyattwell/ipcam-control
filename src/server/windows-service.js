const Service = require('node-windows').Service;
const svc = new Service({
  name: 'IPCamViewer server',
  description: 'IPCamViewer server as a Windows service.',
  script: require('path').join(__dirname, 'server.js')
});
svc.on('install', () => {
  svc.start();
});
svc.install();