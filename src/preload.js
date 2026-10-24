const { contextBridge, ipcRenderer } = require('electron');
const validChannels = ['CAM_INFO', 'CAM_INFO_DATA', 'CAM_MOVE', 'CAM_STOP'];
contextBridge.exposeInMainWorld(
  'ipc', {
    send: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    sendSync: (channel, data) => {
      ipcRenderer.sendSync(channel, data);
    },
    on: (channel, func) => {
      if (validChannels.includes(channel)) {
        // Strip event as it includes `sender` and is a security risk
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  },
);