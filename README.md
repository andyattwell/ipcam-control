# ipcam-control

A web and desktop app to manage ONVIF IP cameras on a local network: discover cameras, watch their live RTSP streams in the browser, control pan, tilt and zoom, take snapshots and browse recordings.

## Features

- **Discovery**: scans the network for ONVIF devices and tests the connection before a camera is saved.
- **Live view**: relays each camera's RTSP stream to the browser over WebSockets (`rtsp-relay`), so no plugin is needed.
- **PTZ control**: pan, tilt and zoom through ONVIF.
- **Snapshots and recordings**: captures still images and lists a camera's recordings.
- **On-screen display**: edits a camera's OSD text.
- **Camera management**: create, edit and delete cameras, stored in a local SQLite database together with their ONVIF data.

## Architecture

| Part | Stack | Location |
| --- | --- | --- |
| Server | Node.js, Express, `onvif`, `rtsp-relay`, ffmpeg, SQLite | `src/server/` |
| Client | Vue 3, Vue Router, Vuex, Bootstrap | `src/frontend/` |
| Desktop shell | Electron (optional) | `src/background.js` |

The server can also run as a Windows service (`src/server/windows-service.js`).

### API

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/cameras` | GET | List cameras |
| `/api/camera` | POST | Create a camera |
| `/api/camera/:id` | GET / POST / DELETE | Read, update or delete a camera |
| `/api/camera/:id/move` | POST | Start a PTZ movement |
| `/api/camera/:id/stop` | POST | Stop the PTZ movement |
| `/api/camera/:id/osd` | POST | Update the on-screen display |
| `/api/camera/:id/recordings` | GET | List recordings |
| `/api/image` | GET | Snapshot, proxied from the camera's snapshot URI |
| `/api/discover` | GET | Scan the network for ONVIF devices |
| `/api/testConnection` | POST | Test the connection to a camera |

## Getting started

Requires Node.js and ffmpeg.

```bash
npm install
cp .env.example .env    # set the API URL, ports and default RTSP credentials
npm run cam:serve       # API and stream server
npm run serve           # web client (or: npm run electron:serve)
```

Camera credentials are entered in the app and stored in the local database, which is git-ignored.
